import updateSession from "../bitrix/updateSession.ts"
import { redis } from "../redis.ts"

export default async () => {
    let cookie = await redis.get("cookie")

    if (!cookie) cookie = await updateSession()

    return cookie
}
