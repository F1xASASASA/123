import keshaVideoMP4 from "@/assets/kesha.mp4"
import keshaVideo from "@/assets/kesha.webm"
import { isEasterEggActivated } from "@/shared/store"
import { AnimatePresence, motion } from "framer-motion"
import { useRecoilState } from "recoil"
import styled from "styled-components"

export const EasterEgg = () => {
    const [isEasterEggActivatedValue, setIsEasterEggActivated] =
        useRecoilState(isEasterEggActivated)

    return (
        <AnimatePresence>
            {isEasterEggActivatedValue && (
                // @ts-expect-error -webkit-backdrop-filter is not defined
                <Wrapper
                    initial={{
                        scale: 0,
                        backdropFilter: "blur(0px)",
                        "-webkit-backdrop-filter": "blur(0px)",
                    }}
                    animate={{
                        scale: 1,
                        backdropFilter: "blur(10px)",
                        "-webkit-backdrop-filter": "blur(10px)",
                    }}
                    exit={{
                        scale: 0,
                        backdropFilter: "blur(0px)",
                        "-webkit-backdrop-filter": "blur(0px)",
                    }}
                >
                    <video
                        onEnded={() => setIsEasterEggActivated(false)}
                        controls={false}
                        width="256"
                        autoPlay={true}
                        webkit-playsinline={true}
                        playsInline={true}
                        muted={true}
                    >
                        <source src={keshaVideoMP4} type="video/mp4" />
                        <source src={keshaVideo} type="video/webm" />
                    </video>
                </Wrapper>
            )}
        </AnimatePresence>
    )
}

const Wrapper = styled(motion.div)`
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: var(--tg-viewport-height);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;

    & > video {
        border-radius: 100%;
        aspect-ratio: 1;
        background-color: ${(props) => props.theme.background.primary};
    }
`
