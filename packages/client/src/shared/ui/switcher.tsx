import styled, { keyframes } from "styled-components"

type SwitcherProps = {
    state?: boolean
    onChangeState?: (newState: boolean) => void
}

export const Switcher = ({ state, onChangeState }: SwitcherProps) => {
    return (
        <SwitcherWrapper data-state={state} onClick={() => onChangeState && onChangeState(!state)}>
            <Circle />
        </SwitcherWrapper>
    )
}

const enable = keyframes`
    from {
        left: 4px;
    }

    50% {
        left: 26px;
    }

    to {
        left: unset;
        right: 4px;
    }
`

const disable = keyframes`
    from {
        right: 4px;
    }

    50% {
        right: 26px;
    }

    to {
        left: 4px;
        right: unset;
    }
`

const Circle = styled.div`
    position: absolute;
    background: ${(props) => props.theme.onAccent};
    border-radius: 16px;
    height: calc(100% - 8px);
    aspect-ratio: 1;
    transition: aspect-ratio 0.3s ease-in-out, transform 0.3s ease-in-out;
`

const SwitcherWrapper = styled.div`
    position: relative;
    /* padding: 4px; */
    width: 56px;
    height: 32px;
    border-radius: 64px;
    background-color: ${(props) => props.theme.background.secondary};
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    padding: 4px;
    user-select: none;

    &[data-state="true"] {
        background: ${(props) => props.theme.accent};
    }

    &[data-state="true"] ${Circle} {
        animation: ${enable} 0.3s ease-in-out;
        animation-fill-mode: forwards;
    }

    &[data-state="false"] ${Circle} {
        animation: ${disable} 0.3s ease-in-out;
        animation-fill-mode: forwards;
    }

    &:hover ${Circle} {
        aspect-ratio: 1.05;
    }

    &:active ${Circle} {
        aspect-ratio: 1.15;
    }
`
