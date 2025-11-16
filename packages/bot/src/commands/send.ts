import { sendMailing } from "@/middlewares/sendMailing"
import { client } from ".."

export const send = () =>
    client.command("send", async (ctx) => {
        if (ctx.from.id !== 663708923) return

        sendMailing()
    })
