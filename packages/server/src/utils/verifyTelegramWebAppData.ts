import { createHmac } from "crypto"

export const verifyTelegramWebAppData = (telegramInitData: string): boolean => {
    const encoded = decodeURIComponent(telegramInitData)

    const secret = createHmac("sha256", "WebAppData").update(<string>Bun.env.TELEGRAM_BOT_TOKEN)

    const arr = encoded.split("&")
    const hashIndex = arr.findIndex((str) => str.startsWith("hash="))
    const hash = arr.splice(hashIndex)[0].split("=")[1]

    arr.sort((a, b) => a.localeCompare(b))

    const dataCheckString = arr.join("\n")

    const _hash = createHmac("sha256", secret.digest()).update(dataCheckString).digest("hex")

    return _hash === hash
}
