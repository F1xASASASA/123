import { MainButton as TelegramMainButton, useWebApp } from "@vkruglikov/react-telegram-web-app"
import { useEffect } from "react"
import { isChrome } from "react-device-detect"
import styled from "styled-components"

type MainButtonProps = {
    label: string
    onClick?: () => void
    isLoading?: boolean
    disabled?: boolean
}

export const MainButton = (props: MainButtonProps) => {
    const { MainButton: mainButton } = useWebApp()

    useEffect(() => {
        if (props.disabled) {
            mainButton.disable()
        } else {
            mainButton.enable()
        }
    }, [props.disabled, mainButton])

    return isChrome && import.meta.env.DEV ? (
        <CustomMainButtonWrapper>
            <CustomMainButton onClick={props.onClick}>
                <CustomMainButtonText children={props.label} />
            </CustomMainButton>
        </CustomMainButtonWrapper>
    ) : (
        <TelegramMainButton
            color={props.disabled ? "#4d4d4d" : undefined}
            textColor={props.disabled ? "#ffffff" : undefined}
            text={props.label}
            onClick={props.onClick}
            progress={props.isLoading}
            disabled={props.disabled}
        />
    )
}

const CustomMainButtonWrapper = styled.div`
    //position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    //padding: 8px;
    //padding: 16px;
    background-color: ${(props) => props.theme.background.secondary};
`

const CustomMainButton = styled.div`
    all: unset;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.theme.accent};
    border-radius: 16px;
    cursor: pointer;
`

const CustomMainButtonText = styled.p`
    color: ${(props) => props.theme.onAccent};
`
