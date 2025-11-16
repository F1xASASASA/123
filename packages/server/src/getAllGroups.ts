import { redis } from "./redis.ts"
import getAllGroups from "./schedule/getAllGroups.ts"

await redis.connect()

await getAllGroups()
