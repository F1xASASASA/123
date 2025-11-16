import { BackButton } from "@vkruglikov/react-telegram-web-app"
import { ReactNode, useCallback, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import styled from "styled-components"

type PageProps = {
    className?: string
    children: ReactNode
    backButton?: boolean
}

export const Page = ({ className, children, backButton = true }: PageProps) => {
    const location = useLocation()
    const navigate = useNavigate()

    const canGoBack = useMemo(() => location.key !== "default", [location.key])
    const goBack = useCallback(() => navigate(-1), [navigate])

    return (
        <>
            {canGoBack && backButton && <BackButton onClick={goBack} />}
            <Wrapper className={className} children={children} />
        </>
    )
}

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 0;
    min-height: var(--tg-viewport-height);
    background-color: ${(props) => props.theme.background.secondary};
`

// const Background = styled.div`
//     position: fixed;
//     right: 0;
//     bottom: 0;
//     width: 100%;
//     aspect-ratio: 1;
//     user-select: none;
//     pointer-events: none;
//     opacity: 0.2;
//     background: radial-gradient(
//         ellipse at bottom right,
//         ${(props) => props.theme.accent},
//         ${(props) => props.theme.background.secondary}
//     );
// `
