import { client, prisma } from ".."

export const unsubscribe = () =>
    client.command("unsubscribe", async (ctx) => {
        await prisma.user.update({
            where: {
                telegramId: ctx.from.id.toString(),
            },
            data: {
                notificationsEnabled: {
                    set: false,
                },
            },
        })

        await ctx.reply("🔕")

        await ctx.replyWithHTML(
            ["<b>Уведомления отключены</b>", "— /subscribe чтобы включить"].join("\n\n")
        )
    })
