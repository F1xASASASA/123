import { PrismaClient } from "@prisma/client"
import { Markup, Telegraf } from "telegraf"
import { DateTime, Settings } from "luxon"
import { Queue } from "./classes/Queue"
import { createClient } from "redis"
import { start } from "./commands/start"
import { defaultKeyboard } from "./keyboards/defaultKeyboard"
import { sendMailing } from "./middlewares/sendMailing"
import { subscribe } from "./commands/subscribe"
import { unsubscribe } from "./commands/unsubscribe"
import { send } from "./commands/send"

Settings.defaultLocale = "ru"
Settings.defaultZone = "Asia/Yekaterinburg"

export const redis = await createClient({
    url: Bun.env.REDIS_URL,
}).connect()

export const prisma = new PrismaClient()

export const client = new Telegraf(<string>Bun.env.TELEGRAM_BOT_TOKEN, {
    telegram: {
        testEnv: Bun.env.TELEGRAM_TEST_ENV === "true",
    },
})

client.hears(/http/, (ctx) => {
    if (Bun.env.TELEGRAM_TEST_ENV !== "true") return

    ctx.reply("Привет, я знаю актуальное расписание МИДиС!", {
        ...Markup.inlineKeyboard([[Markup.button.webApp("Открыть расписание", ctx.message.text)]]),
    })

    ctx.setChatMenuButton({
        text: "Расписание",
        type: "web_app",
        web_app: {
            url: ctx.message.text,
        },
    })
})

Promise.all([start(), subscribe(), unsubscribe(), send()])

export const messageQueue = new Queue<{ chatId: string | number; text: string }>(
    async ({ chatId, text }, next) => {
        const sendMessage = () =>
            client.telegram.sendMessage(chatId, text, {
                parse_mode: "HTML",
                ...defaultKeyboard,
            })

        sendMessage()
            .then(() => next())
            .catch(() => {
                setTimeout(() => {
                    sendMessage()
                        .then(() => next())
                        .catch(() => next())
                }, 5000)
            })
    },
)

setInterval(() => {
    const time = DateTime.now()

    if (time.hour !== 18 || time.minute !== 18 || time.second !== 0) return

    sendMailing()
}, 1000)

await Promise.any([client.launch()])
