import getSession from "./getSession.ts"
import { redis } from "../redis.ts"

export default async (): Promise<string> => {
    const { cookie } = await getSession(
        <string>Bun.env.BITRIX_LOGIN,
        <string>Bun.env.BITRIX_PASSWORD,
    )

    await redis.set("cookie", cookie, { EX: 10 * 60 })

    return cookie
}
