import updateSession from "../bitrix/updateSession.ts"
import { redis } from "../redis.ts"
import parseTeacherSchedule, { TeacherSchedule } from "./parseTeacherSchedule.ts"

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function (
    teacher: string,
): Promise<{ teacher: string; schedule: TeacherSchedule } | undefined> {
    let cookie = await redis.get("cookie")

    if (!cookie) cookie = await updateSession()

    let url = <string>Bun.env.BITRIX_URL + `mobile/teacher/schedule/teacher.php?id=${teacher}`

    const response = await fetch(url, {
        headers: {
            Cookie: cookie,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })

    const body = await response.text()

    const parsedSchedule = parseTeacherSchedule(body)

    if (!parsedSchedule) return

    await delay(1000)

    return {
        teacher,
        schedule: parsedSchedule,
    }
}
