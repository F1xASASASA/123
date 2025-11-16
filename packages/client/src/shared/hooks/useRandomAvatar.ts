import avatar1 from "@/assets/avatars/1.webp"
import avatar2 from "@/assets/avatars/2.webp"
import avatar3 from "@/assets/avatars/3.webp"
import avatar4 from "@/assets/avatars/4.webp"
import avatar5 from "@/assets/avatars/5.webp"
import avatar6 from "@/assets/avatars/6.webp"
import avatar7 from "@/assets/avatars/7.webp"

import shuffle from "../utils/shuffle"
import getRandomFromList from "../utils/getRandomFromList"
import { useMemo } from "react"

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7]

export default (count: number = 1) => {
    return useMemo(() => {
        if (avatars.length < count)
            return Array.from({ length: count }).map(() => getRandomFromList(avatars))

        return shuffle(avatars).slice(0, count)
    }, [count])
}
