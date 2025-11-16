import { ReactNode } from "react"
import styled from "styled-components"

type SectionBodyProps = {
    children?: ReactNode
    className?: string
    isInModal?: boolean
    type?: "primary" | "secondary"
}

export const Section = {
    Wrapper: styled.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
    `,
    Body: ({ children, className, type }: SectionBodyProps) => {
        return <BodyWrapper className={className} $type={type ?? "primary"} children={children} />
    },
    Header: styled.p`
        padding: 0 16px;
        font-size: 12px;
        font-weight: 400;
        text-transform: uppercase;
        opacity: 0.5;
    `,
    Footer: styled.p`
        padding: 0 16px;
        font-size: 14px;
        font-weight: 400;
        opacity: 0.5;
        min-height: 1rem;
    `,
}

const BodyWrapper = styled.div<{ $type: "primary" | "secondary" }>`
    border-radius: 16px;
    background-color: ${(props) => props.theme.background[props.$type]};
    display: flex;
    flex-direction: column;

    > * + * {
        position: relative;
    }

    > * + *::before {
        content: "";
        position: absolute;
        left: 16px;
        top: 0;
        right: 0;
        height: 1px;
        border-radius: 1px;
        opacity: 0.1;
        background: ${(props) => props.theme.text};
    }
`
