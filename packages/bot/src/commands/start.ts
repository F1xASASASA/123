import { client, prisma } from ".."
import { defaultKeyboard } from "../keyboards/defaultKeyboard"
import { Prisma } from "@prisma/client"

export const start = () =>
    client.start(async (ctx) => {
        await ctx.reply("Привет, я знаю актуальное расписание МИДиС!", {
            ...defaultKeyboard
        })

        await ctx.setChatMenuButton({
            text: "Расписание",
            type: "web_app",
            web_app: {
                url: Bun.env.TELEGRAM_WEB_APP_URL!
            }
        })

        let userData = await prisma.user.findFirst({
            where: { telegramId: ctx.from.id.toString() }
        })

        if (!userData) await prisma.user.create({
            data: {
                telegramId: ctx.from.id.toString(),
                telegramData: ctx.from as unknown as Prisma.JsonObject
            }
        })
    })
