import { DateTime } from "luxon"
import { emojiNumbers } from "../utils/emojiNumbers"
import { prisma, redis, messageQueue } from ".."

export const sendMailing = async () => {
    const users = await prisma.user.findMany({
        where: {
            notificationsEnabled: true,
            group: { not: null },
        },
    })

    const tomorrow = DateTime.now().plus({ day: 1 })

    for (const user of users) {
        console.log(`schedule.${user.group}.${tomorrow.toFormat("y-MM-dd")}`)

        const schedule = JSON.parse(
            (await redis.get(`schedule.${user.group}.${tomorrow.toFormat("y-MM-dd")}`)) ?? "{}"
        ) as {
            number: number
            subject: string
            classroom: string
            flow: string
            cancelled: boolean
        }[]

        // console.log(schedule)

        if (!Array.isArray(schedule) || schedule.length === 0 || tomorrow.weekday == 7) continue

        messageQueue.addToQueue({
            chatId: user.telegramId,
            text:
                schedule.length === 0
                    ? "Привет, на завтра отсутствует расписание"
                    : [
                          `Привет, расписание на завтра (${tomorrow.toFormat("d MMMM")}):`,
                          ...schedule.map((lesson) =>
                              lesson.cancelled
                                  ? `${emojiNumbers[lesson.number]} <b>Занятие отменено</b>`
                                  : `${emojiNumbers[lesson.number]} <b>${lesson.subject}</b> — ${
                                        lesson.classroom
                                    }`
                          ),
                          "Отключить рассылку — /unsubscribe",
                      ].join("\n\n"),
        })
    }
}
