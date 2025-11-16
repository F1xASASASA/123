import timerBackgroundImage from "@/assets/timerBackgroundImage.png"
import { useQuery } from "@tanstack/react-query"
import { useCloudStorage } from "@vkruglikov/react-telegram-web-app"
import { motion, useScroll, useTransform } from "framer-motion"
import { Duration } from "luxon"
import { useEffect, useMemo } from "react"
import styled from "styled-components"
import useHapticFeedback from "../hooks/useHapticFeedback"

type MainTimerProps = {
    title: string
    duration: number
}

export const MainTimer = ({ duration, title }: MainTimerProps) => {
    const { scrollY } = useScroll()
    const { getItem } = useCloudStorage()
    const { impactOccurred } = useHapticFeedback()

    const { data: isTimerWithFeedback } = useQuery({
        queryKey: ["isTimerWithFeedback", "get"],
        queryFn: async () => (await getItem("isTimerWithFeedback")) === "true",
    })

    useEffect(() => {
        if (!isTimerWithFeedback) return

        impactOccurred("soft")
    }, [impactOccurred, isTimerWithFeedback, duration])

    const backgroundPosition = useTransform(scrollY, [0, window.innerHeight], [0, -96])

    const timer = useMemo(() => {
        const x = Duration.fromMillis(duration).negate().rescale().toFormat("hh:mm:ss")

        if (x.split(":").length > 2) {
            return x.replace(/^00:/m, "")
        } else return x
    }, [duration])

    return (
        <TimerWrapper>
            <Background
                style={{
                    top: backgroundPosition,
                }}
            />
            <Timer children={timer} />
            <Title children={title} />
        </TimerWrapper>
    )
}

const TimerWrapper = styled.div`
    position: relative;
    display: flex;
    height: 96px;
    overflow: hidden;
    border-radius: 16px;
    /* border-bottom: 3px solid #007aff; */
    background: ${(props) => props.theme.background.primary};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: stretch;
`

const Background = styled(motion.img).attrs({
    src: timerBackgroundImage,
    draggable: "false",
})`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
`

const Timer = styled.p`
    font-variant-numeric: lining-nums tabular-nums;
    color: ${(props) => props.theme.accent};
    font-size: 32px;
    line-height: 32px;
    font-weight: 700;
`

const Title = styled.p`
    /* opacity: 0.55; */
    color: ${(props) => props.theme.text};
    font-size: 16px;
    line-height: 16px;
    font-weight: 400;
`
