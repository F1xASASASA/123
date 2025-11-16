import { DateTime } from "luxon"

export const getRedisKeyUserGroup = (id: number) => `user.${id}.group`

export const getRedisKeyDayGroupSchedule = (group: string, date: Date) =>
    `schedule.${group.toUpperCase().replace(/—|–/g, "-")}.${DateTime.fromJSDate(date).toFormat(
        "y-MM-dd",
    )}`

export const getRedisKeyDayGroupTeachers = (group: string, date: Date) =>
    `schedule.${group.toUpperCase().replace(/—|–/g, "-")}.${DateTime.fromJSDate(date).toFormat(
        "y-MM-dd",
    )}.teachers`

export const getRedisKeyUserUpdateSchedule = (id: string) => `scheduleRetrievalAttempts.${id}`
