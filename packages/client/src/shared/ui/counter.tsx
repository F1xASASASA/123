import styled from "styled-components"
import useRandomAvatar from "../hooks/useRandomAvatar"

type CounterProps = {
    label: string
    count: number
}

export const Counter = ({ label, count }: CounterProps) => {
    const avatars = useRandomAvatar(3)

    return (
        <CounterWrapper>
            <Avatars>
                {avatars.map((x, i) => (
                    <Avatar key={i} src={x} />
                ))}
            </Avatars>
            <TextWrapper>
                <CounterText children={count} />
                <LabelText children={label} />
            </TextWrapper>
        </CounterWrapper>
    )
}

const CounterWrapper = styled.div`
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
`

const Avatars = styled.div`
    display: flex;
    padding-left: 16px;
`

const Avatar = styled.img.attrs({
    draggable: false,
})`
    width: 32px;
    height: 32px;
    border-radius: 100%;
    margin-left: -8px;
    background-color: ${(props) => props.theme.background.primary};
    outline: 4px solid ${(props) => props.theme.background.secondary};
`

const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 220px;
`

const CounterText = styled.p`
    font-size: 20px;
    font-weight: 500;
`

const LabelText = styled.p`
    opacity: 0.75;
`
