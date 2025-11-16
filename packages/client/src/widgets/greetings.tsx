import { trpc } from "@/shared/api"
import { isGreetingsShown } from "@/shared/store"
import getGreetings from "@/shared/utils/getGreetings"
import { isTeacher } from "@/shared/utils/isTeacher"
import { motion } from "framer-motion"
import { DateTime } from "luxon"
import { useMemo, useState } from "react"
import { useRecoilState } from "recoil"
import styled from "styled-components"

const now = DateTime.now()

export const Greetings = () => {
    const [isShown, setIsShown] = useState(true)

    const { data: userGroup, isSuccess: isUserGroupLoaded } = trpc.group.getUserGroup.useQuery()

    const { data: schedule, isSuccess: isScheduleLoaded } = trpc.schedule.getSchedule.useQuery({
        date: DateTime.now().startOf("day").toJSDate(),
        groupName: userGroup ?? "",
    })

    const [isGreetingsShownValue, setIsGreetingsShown] = useRecoilState(isGreetingsShown)

    const text = useMemo(() => {
        if (!schedule || !userGroup || !schedule) return ""

        const greetings = getGreetings({ userGroup, schedule })

        return greetings[now.toMillis() % greetings.length]
    }, [schedule, userGroup])

    return (
        !isGreetingsShownValue &&
        !isTeacher(userGroup) &&
        isShown &&
        isUserGroupLoaded &&
        isScheduleLoaded && (
            <TextWrapper
                onClick={() => {
                    setIsGreetingsShown(true)
                    setIsShown(false)
                }}
                initial={{
                    opacity: 1,
                }}
                animate={{
                    opacity: 0,
                }}
                transition={{
                    duration: 0.5,
                    delay: 5,
                }}
                onAnimationComplete={() => {
                    setIsGreetingsShown(true)
                    setIsShown(false)
                }}
            >
                <Text $small={text?.length > 50} children={text} />
            </TextWrapper>
        )
    )
}

const TextWrapper = styled(motion.div)`
    background-color: ${(props) => props.theme.background.secondary};
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    padding: 0 16px;
`

const Text = styled.p<{ $small: boolean }>`
    font-weight: 500;
    font-size: ${(props) => (props.$small ? "16px" : "18px")};
`
