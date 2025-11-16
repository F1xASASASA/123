import cors from "@fastify/cors"
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify"
import fastify from "fastify"
import { DateTime, Settings } from "luxon"
import { appRouter } from "./appRouter"
import { redis } from "./redis"
import updateSchedule from "./schedule/updateSchedule"
import { createContext } from "./trpc"

Settings.defaultZone = "Asia/Yekaterinburg"

const server = fastify({
    maxParamLength: 5000,
})

server.register(cors, {
    origin: "*",
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Accept",
        "Content-Type",
        "Authorization",
        "Cookie",
        "bypass-tunnel-reminder",
    ],
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
})

server.register(fastifyTRPCPlugin, {
    prefix: "/api",
    trpcOptions: {
        router: appRouter,
        createContext,
    },
})

await redis.connect()

await server.listen({
    port: parseInt(<string>Bun.env.SERVER_PORT) || 3000,
    host: '0.0.0.0'
})

console.log(`Server started on ${parseInt(<string>Bun.env.SERVER_PORT) || 3000} port`)

if (Bun.env.UPDATE_ON_START === "true") updateSchedule()

// if (Bun.env.UPDATE_ON_START === "true") getAllGroups()

const tryUpdate = () => {
    const now = DateTime.now()

    if (now.hour > 17 || now.hour < 5) return

    updateSchedule()
}

setInterval(
    () => {
        tryUpdate()
    },
    1000 * 60 * 60,
)
