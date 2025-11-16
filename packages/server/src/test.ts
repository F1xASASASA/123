import { appRouter } from "./appRouter.ts"
import { redis } from "./redis.ts"
import getSchedule from "./schedule/getSchedule.ts"

await redis.connect()

console.log((await getSchedule("ПИ-228"))?.schedule[1])

// const caller = t.createCallerFactory(appRouter)({
//     user: {
//         query_id: "AAF0BBMqAgAAAHQEEypUqStA",
//         user: '{"id":5000856692,"first_name":"Виталий","last_name":"DEV TEST","username":"vvlay","language_code":"en","allows_write_to_pm":true}',
//         auth_date: "1704955171",
//         hash: "e5866c488fdd1d034e958328f5782d7a7bf2c727d31cf6dfb105202cc7d54ed2",
//         id: 5000856692,
//         first_name: "Виталий",
//         last_name: "DEV TEST",
//         username: "vvlay",
//         language_code: "en",
//         allows_write_to_pm: true,
//     },
// })

// await caller.person.create({
//     telegramId: "5000856692",
//     name: "Виталий",
// })
//
// console.log(await caller.person.getMany())
//
// console.log(
//     await caller.event.create({
//         type: "birthday",
//         date: parseISO("2004-05-13"),
//         persons: [1],
//     }),
// )
//
// console.log(await caller.event.getMany())
//
// console.log(await caller.event.getOne({ id: 1 }))
