import { FloatingPortal } from "@floating-ui/react"
import { Icon } from "@iconify/react"
import { AnimatePresence, motion } from "framer-motion"
import { ReactNode, createContext, useContext } from "react"
import styled from "styled-components"

type ModalWrapperProps = {
    isOpened: boolean
    onClose: () => void
    children: ReactNode
}

type ModalBodyProps = {
    children: ReactNode
}

type ModalTitleProps = {
    title: string
    withPadding?: boolean
    center?: boolean
}

const CloseButton = () => {
    const modal = useContext(ModalContext)

    return (
        <CloseButtonWrapper onClick={modal?.onClose}>
            <Icon icon={"ic:round-close"} />
        </CloseButtonWrapper>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const Modal = {
    Wrapper: ({ isOpened, children, onClose }: ModalWrapperProps) => {
        return (
            <ModalContext.Provider value={{ onClose }}>
                <AnimatePresence>
                    {isOpened && (
                        <FloatingPortal>
                            <Wrapper
                                initial={{ backgroundColor: "#00000000", "--blur": "0px" }}
                                animate={{ backgroundColor: "#00000090", "--blur": "4px" }}
                                exit={{ backgroundColor: "#00000000", "--blur": "0px" }}
                                onClick={onClose}
                                children={children}
                            />
                        </FloatingPortal>
                    )}
                </AnimatePresence>
            </ModalContext.Provider>
        )
    },
    Body: ({ children }: ModalBodyProps) => {
        return (
            <Body
                onClick={(e) => e.stopPropagation()}
                initial={{ translateY: "100%" }}
                animate={{ translateY: 0 }}
                exit={{ translateY: "100%" }}
                transition={{
                    duration: 0.3,
                    type: "spring",
                    bounce: false,
                }}
            >
                {children}
            </Body>
        )
    },
    CloseButton,
    Title: ({ title, withPadding, center }: ModalTitleProps) => {
        return (
            <TitleWrapper $center={!!center} $withPadding={!!withPadding}>
                <Title className={"title"} children={title} />
                <CloseButton />
            </TitleWrapper>
        )
    },
}

export const ModalContext = createContext<{ onClose: () => void } | null>(null)

const Wrapper = styled(motion.div)`
    --blur: 0px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: var(--tg-viewport-height);
    background-color: #00000040;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    backdrop-filter: blur(var(--blur));
    -webkit-backdrop-filter: blur(var(--blur));
`

const Body = styled(motion.div)`
    display: flex;
    bottom: 0;
    position: relative;
    padding: 16px;
    flex-direction: column;
    gap: 16px;
    border-radius: 16px 16px 0 0;
    background: ${(props) => props.theme.background.primary};
    max-height: calc(var(--tg-viewport-height) * 0.9);
    overflow: auto;
`

const CloseButtonWrapper = styled.div`
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--tg-theme-bg-color);
    border-radius: 16px;
    cursor: pointer;
`

const TitleWrapper = styled.div<{ $withPadding: boolean; $center: boolean }>`
    display: flex;
    justify-content: ${(props) => props.$center && "space-between"};
    padding: ${(props) => props.$withPadding && "0 16px;"};
    padding-left: ${(props) => props.$center && "24px"};

    & > .title {
        flex: 1;
        text-align: ${(props) => props.$center && "center"};
    }
`

const Title = styled.h2`
    font-size: 20px;
    font-weight: 500;
`
