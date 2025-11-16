import { Prisma, PrismaClient } from "@prisma/client"
import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server"
import * as trpcFastify from "@trpc/server/adapters/fastify"
import superjson from "superjson"
import { urlSearchParamsToObject } from "./utils/urlSearchParamsToObject"
import { verifyTelegramWebAppData } from "./utils/verifyTelegramWebAppData"

export async function createContext({ req }: trpcFastify.CreateFastifyContextOptions) {
    async function getUserFromHeader() {
        if (req.headers.authorization && verifyTelegramWebAppData(req.headers.authorization)) {
            const data = urlSearchParamsToObject(new URLSearchParams(req.headers.authorization))

            return { ...data, ...JSON.parse(data.user) }
        }
        else {
            console.error("Can't authorize", req.headers.authorization)
        }

        return null
    }

    const user = await getUserFromHeader()

    return {
        user,
    }
}

export type Context = inferAsyncReturnType<typeof createContext>

export const prisma = new PrismaClient()

export const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter:
        Bun.env.TELEGRAM_TEST_ENV === "true"
            ? undefined
            : (opts) => {
                const { shape, error } = opts

                const message =
                    error.message.includes("trpc") ||
                    error.message.includes("prisma")
                        ? undefined
                        : error.message

                // console.error(
                //     "Error catch",
                //     JSON.stringify({
                //         shape,
                //         error,
                //         message,
                //     }),
                // )

                return {
                    message,
                    data: {
                        code: shape.data.code,
                        httpStatus: shape.data.httpStatus,
                    },
                }
            },
})

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = publicProcedure.use(async (opts) => {
    // if (Bun.env.TELEGRAM_TEST_ENV !== "true") console.log(opts)

    if (!opts.ctx.user || !opts.ctx.user.id)
        throw new TRPCError({
            code: "UNAUTHORIZED",
        })

    let userData = await prisma.user.findFirst({
        where: {
            telegramId: opts.ctx.user.id.toString(),
        }
    })

    if (!userData) {
        userData = await prisma.user.create({
            data: {
                telegramId: opts.ctx.user.id.toString(),
                telegramData: JSON.parse(opts.ctx.user.user) as Prisma.JsonObject,
            }
        })
    }
    else {
        await prisma.user.update({
            where: {
                id: userData.id,
            },
            data: {
                telegramData: JSON.parse(opts.ctx.user.user) as Prisma.JsonObject,
            },
        })
    }

    return opts.next({
        ctx: {
            ...opts.ctx,
            userData,
        },
    })
})
export const middleware = t.middleware
