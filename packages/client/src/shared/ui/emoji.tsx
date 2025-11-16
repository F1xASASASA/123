import { useQuery } from "@tanstack/react-query"
import { useHapticFeedback } from "@vkruglikov/react-telegram-web-app"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import { useRef } from "react"

type EmojiProps = {
    animationData: unknown
    width?: number
    height?: number
    className?: string
    loop?: boolean
}

export const Emoji = ({
    animationData: animationUrl,
    width = 96,
    height = 96,
    className,
    loop = false,
}: EmojiProps) => {
    const lottieRef = useRef<LottieRefCurrentProps>(null)
    const { data: animationData } = useQuery({
        queryKey: ["emoji", animationUrl],
        queryFn: () => fetch("/emojis/" + animationUrl + ".json").then((res) => res.json()),
        staleTime: Infinity,
    })

    const [impactOccurred] = useHapticFeedback()

    return (
        <Lottie
            lottieRef={lottieRef}
            className={className}
            style={{ width, height }}
            animationData={animationData}
            loop={loop}
            autoPlay={true}
            onClick={() => {
                impactOccurred("soft")

                const isLastFrame =
                    lottieRef.current?.animationItem?.currentFrame ===
                    (lottieRef.current?.animationItem?.totalFrames ?? 0) - 1

                if (!isLastFrame) return

                lottieRef.current?.goToAndPlay(0)
            }}
        />
    )
}
