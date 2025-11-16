import { Icon } from "@iconify/react"
import styled from "styled-components"

export const IconButton = () => {
    return (
        <Button>
            <Icon icon={"mdi:bell"} width={24} height={24} />
        </Button>
    )
}

const Button = styled.button`
    all: unset;
    display: flex;
    width: 48px;
    height: 48px;
    padding: 6px;
    border-radius: 16px;
    background: ${(props) => props.theme.background.primary};
    justify-content: center;
    align-items: center;
    color: ${(props) => props.theme.text};
    gap: 10px;
`
