import { client, prisma } from ".."

export const subscribe = () =>
    client.command("subscribe", async (ctx) => {
        await prisma.user.update({
            where: {
                telegramId: ctx.from.id.toString(),
            },
            data: {
                notificationsEnabled: {
                    set: true,
                },
            },
        })

        await ctx.reply("🔔")

        await ctx.replyWithHTML(
            [
                "<b>Теперь ты будешь получать уведомления в 18:00 с расписанием на следующий день</b>",
                "— /unsubscribe чтобы отключить",
            ].join("\n\n")
        )
    })
