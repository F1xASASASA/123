import { Icon } from "@iconify/react"
import { ReactNode } from "react"
import styled from "styled-components"

type ButtonProps = {
    label: string
    leadingIcon?: string | ReactNode
    isLoading?: boolean
    onClick?: () => void
}

export const Button = ({ label, leadingIcon, isLoading, onClick }: ButtonProps) => {
    return (
        <ButtonWrapper onClick={onClick}>
            {typeof leadingIcon === "string" && <Icon width={16} icon={leadingIcon} />}

            {isLoading ? <span children={"Loading..."} /> : <span children={label} />}
        </ButtonWrapper>
    )
}

const ButtonWrapper = styled.button`
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    width: 100%;
    height: 48px;
    border-radius: 12px;
    background-color: ${(props) => props.theme.accent};
    color: ${(props) => props.theme.onAccent};
    fill: ${(props) => props.theme.onAccent};
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;

    flex-direction: row;
    gap: 8px;

    transition: scale 0.3s ease-in-out, filter 0.3s ease-in-out;

    &:hover {
        /* scale: 1.01; */
    }

    &:active {
        scale: 0.99;
    }
`
