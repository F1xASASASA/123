import { z } from "zod"
import { prisma, privateProcedure, publicProcedure, router } from "../trpc"
import { redis } from "../redis"
import { TRPCError } from "@trpc/server"

export const group = router({
    getUserGroup: privateProcedure.query(async ({ ctx }) => {
        return (
            await prisma.user.findFirst({
                where: {
                    id: ctx.userData.id,
                },
            })
        )?.group
    }),
    getGroups: publicProcedure.query(async () => {
        const groups = JSON.parse((await redis.get("groups")) ?? "{}") as string[]
        const teachers = (
            JSON.parse((await redis.get("teachers")) ?? "{}") as { name: string }[]
        ).map((x) => x.name)

        return [...groups, ...teachers]
    }),
    setUserGroup: privateProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        const groups = JSON.parse((await redis.get("groups")) ?? "{}") as string[]

        const teachers = (
            JSON.parse((await redis.get("teachers")) ?? "{}") as { name: string }[]
        ).map((x) => x.name)

        if (!groups.includes(input) && !teachers.includes(input))
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Group not found",
            })

        return prisma.user.update({
            where: {
                id: ctx.userData.id,
            },
            data: {
                group: input,
            },
        })
    }),
})
