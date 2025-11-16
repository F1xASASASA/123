import parseSchedule, { type Schedule } from "./parseSchedule.ts"
import updateSession from "../bitrix/updateSession.ts"
import { redis } from "../redis.ts"

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function (
    group: string,
): Promise<{ group: string; schedule: Schedule } | undefined> {
    let cookie = await redis.get("cookie")

    if (!cookie) cookie = await updateSession()

    const transformedGroup = group.split("(")[0]

    console.log(`Getting schedule for ${group}`)

    let url =
        <string>Bun.env.BITRIX_URL +
        `mobile/teacher/schedule/spo_and_vo.php?name=${transformedGroup}`

    const response = await fetch(url, {
        headers: {
            Cookie: cookie,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })

    const body = await response.text()

    const parsedSchedule = parseSchedule(body, group)

    if (!parsedSchedule) return

    await delay(1000)

    return {
        group,
        schedule: parsedSchedule,
    }
}
