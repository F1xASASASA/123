import { Markup } from "telegraf"

export const defaultKeyboard = Markup.inlineKeyboard([
    [Markup.button.webApp("Открыть расписание", Bun.env.TELEGRAM_WEB_APP_URL!)],
])
