import { DateTime } from "luxon"
import {
    getRedisKeyDayGroupSchedule,
    getRedisKeyDayGroupTeachers,
    getRedisKeyUserUpdateSchedule,
} from "../redis/keys"
import { redis } from "../redis"
import { prisma, privateProcedure, publicProcedure, router } from "../trpc"
import { z } from "zod"
import updateSchedule from "../schedule/updateSchedule"
import { TRPCError } from "@trpc/server"

type Schedule = {
    number?: number
    subject?: string
    classroom?: string
    group?: string
    flow: string
    startsAt?: Date
    endsAt?: Date
    cancelled: boolean
    modified: boolean
    original?: {
        number: number
        subject: string
        classroom: string
        flow: string
        cancelled: boolean
    }
}[]

const getTeacherId = async (name: string) => {
    const teachers = JSON.parse((await redis.get("teachers")) ?? "[]") as {
        name: string
        id: string
    }[]

    return teachers.find((x) => x.name === name)?.id ?? null
}

const formatClassroom = (classroom?: string) => {
    return classroom && parseInt(classroom) < 100
        ? undefined
        : classroom?.replace("305Акт", "Актовый зал")
}

const setTime = (date: Date, time: string) =>
    DateTime.fromJSDate(date, { zone: "Asia/Yekaterinburg" })
        .set({
            hour: parseInt(time.split(":")[0]),
            minute: parseInt(time.split(":")[1]),
        })
        .toJSDate()

const getBellSchedule = async (date: Date) => {
    const data = JSON.parse((await redis.get("schedule")) ?? "{}") as {
        days: number[]
        schedule: {
            number: number
            type?: string
            time: {
                start: string
                end: string
            }
            attachments?: [
                {
                    number: 1
                    time: {
                        start: string
                        end: string
                    }
                },
                {
                    number: 2
                    time: {
                        start: string
                        end: string
                    }
                },
            ]
        }[]
    }[]

    const schedule = data.find((x) => x.days.includes(DateTime.fromJSDate(date).weekday))?.schedule

    if (!schedule) return null

    return schedule.map((lesson) => ({
        ...lesson,
        time: {
            start: setTime(date, lesson.time.start),
            end: setTime(date, lesson.time.end),
        },
        attachments: lesson.attachments?.map((attachment) => ({
            ...attachment,
            time: {
                start: setTime(date, attachment.time.start),
                end: setTime(date, attachment.time.end),
            },
        })),
    }))
}

export const schedule = router({
    getScheduleUpdateTime: publicProcedure.query(async () => {
        const updatedAt = await redis.get("scheduleUpdatedAt")

        if (!updatedAt) return null

        return DateTime.fromISO(updatedAt).toJSDate()
    }),
    getBellSchedule: publicProcedure
        .input(
            z.object({
                date: z.date(),
            }),
        )
        .query(async ({ input }) => getBellSchedule(input.date)),
    getTimers: publicProcedure
        .input(
            z.object({
                date: z.date(),
                groupName: z.string().optional(),
            }),
        )
        .query(async ({ input }) => {
            const bells = await getBellSchedule(input.date)

            const schedule = input.groupName
                ? (JSON.parse(
                      (await redis.get(getRedisKeyDayGroupSchedule(input.groupName, input.date))) ??
                          "{}",
                  ) as Schedule)
                : undefined

            let events: {
                mainTimerTitle: string
                secondaryTimerTitle: string
                time: Date
            }[] = []

            bells?.forEach(({ attachments, time, number, type }) => {
                if (type === "lunch") return

                if (schedule?.findIndex((x) => x.number === number) === -1) return

                events.push(
                    {
                        mainTimerTitle: `до начала ${number} пары`,
                        secondaryTimerTitle: `Начало ${number} пары`,
                        time: time.start,
                    },
                    {
                        mainTimerTitle: `до конца половины ${number} пары`,
                        secondaryTimerTitle: `Конец половины ${number} пары`,
                        time: (attachments ?? [])[0]?.time.end,
                    },
                    {
                        mainTimerTitle: `до продолжения ${number} пары`,
                        secondaryTimerTitle: `Продолжение ${number} пары`,
                        time: (attachments ?? [])[1]?.time.start,
                    },
                    {
                        mainTimerTitle: `до конца ${number} пары`,
                        secondaryTimerTitle: `Конец ${number} пары`,
                        time: time.end,
                    },
                )
            })

            return events
        }),
    getSchedule: privateProcedure
        .input(
            z.object({
                groupName: z.string().min(1),
                date: z.date(),
            }),
        )
        .query(async ({ input, ctx }) => {
            if (DateTime.fromJSDate(input.date).weekday === 7) return []

            const isTeacher = input.groupName.split(" ").length > 1 && input.groupName.length > 8

            const isGreaterThanLimit =
                DateTime.fromJSDate(input.date)
                    .diff(DateTime.now().plus({ week: 1 }).endOf("week"))
                    .toMillis() > 0

            const realDate = isGreaterThanLimit
                ? DateTime.fromJSDate(input.date).minus({ week: 2 }).toJSDate()
                : input.date

            let unparsedData = await redis.get(
                getRedisKeyDayGroupSchedule(
                    isTeacher ? (await getTeacherId(input.groupName))! : input.groupName,
                    realDate,
                ),
            )

            await prisma.user.updateMany({
                where: {
                    id: ctx.userData.id,
                    latestLaunch: {
                        lt: DateTime.now().minus({ minutes: 1 }).toJSDate(),
                    },
                },
                data: {
                    latestLaunch: new Date(),
                    timesLaunched: {
                        increment: 1,
                    },
                },
            })

            if (!unparsedData && !isTeacher) {
                const isUserAttemptedRetrieveSchedule = await redis.get(
                    getRedisKeyUserUpdateSchedule(ctx.userData.telegramId),
                )

                if (isUserAttemptedRetrieveSchedule)
                    throw new TRPCError({
                        code: "TIMEOUT",
                    })

                await redis.setEx(getRedisKeyUserUpdateSchedule(ctx.userData.telegramId), 10, "1")

                await updateSchedule([input.groupName])

                unparsedData = await redis.get(
                    getRedisKeyDayGroupSchedule(input.groupName, input.date),
                )
            }

            const data = JSON.parse(unparsedData ?? "{}")

            const teachersData = JSON.parse(
                (await redis.get(getRedisKeyDayGroupTeachers(input.groupName, realDate))) ?? "[]",
            ) as { number: number; teacher: string }[]

            if (!Array.isArray(data))
                throw new TRPCError({
                    code: "PARSE_ERROR",
                })

            const bells = await getBellSchedule(input.date)

            return (data as Schedule).map((lesson) => ({
                ...lesson,
                classroom: formatClassroom(lesson.classroom),
                startsAt: bells?.find((x) => x.number === lesson.number)?.time.start,
                endsAt: bells?.find((x) => x.number === lesson.number)?.time.end,
                teachers: teachersData
                    .filter((x) => x.number === lesson.number)
                    .map((x) => x.teacher),
            }))
        }),
})
