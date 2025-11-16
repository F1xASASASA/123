import { ComponentPropsWithoutRef } from "react"
import styled from "styled-components"
import { cn } from "../utils/cn"

export const SectionWrapper = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
    <div className={cn("flex flex-col gap-2", className)} {...props} />
)

export const SectionBody = styled.div<{ type: "primary" | "secondary" }>`
    border-radius: 16px;
    background-color: ${(props) => props.theme.background[props.type]};
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

export const SectionHeader = styled.p`
    padding: 0 16px;
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
    opacity: 0.5;
`

export const SectionFooter = styled.p`
    padding: 0 16px;
    font-size: 14px;
    font-weight: 400;
    opacity: 0.5;
    min-height: 1rem;
`
