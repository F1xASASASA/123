import { DateTime } from "luxon"
import { redis } from "./redis.ts"
import { group } from "./routers/group"
import { schedule } from "./routers/schedule.ts"
import { prisma, privateProcedure, router } from "./trpc.ts"

export const appRouter = router({
    healthcheck: privateProcedure.query(async () => {
        const isTechnicalWork = await redis.get("isTechnicalWork")

        if (isTechnicalWork === "true") {
            return {
                isTechnicalWork: isTechnicalWork === "true",
                title: await redis.get("technicalWorkTitle"),
                description: await redis.get("technicalWorkDescription"),
            }
        } else {
            return {
                isTechnicalWork: false,
            }
        }
    }),
    getStats: privateProcedure.query(async () => {
        const allUsers = await prisma.user.count()

        const todayUsers = await prisma.user.count({
            where: {
                latestLaunch: {
                    gt: DateTime.now().minus({ hours: 24 }).toJSDate(),
                },
            },
        })

        const currentUsers = await prisma.user.count({
            where: {
                latestLaunch: {
                    gt: DateTime.now().minus({ minutes: 1 }).toJSDate(),
                },
            },
        })

        return {
            allUsers,
            todayUsers,
            currentUsers,
        }
    }),
    schedule,
    group,
})
