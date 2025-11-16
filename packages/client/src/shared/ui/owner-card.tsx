import { useWebApp } from "@vkruglikov/react-telegram-web-app"
import styled from "styled-components"

type OwnerCardProps = {
    image?: string
    title: string
    telegramLink: string
}

export const OwnerCard = ({ image, title, telegramLink }: OwnerCardProps) => {
    const { openTelegramLink } = useWebApp()

    return (
        <Wrapper>
            <Image src={image} />
            <TextWrapper>
                <Title children={title} />
                <TelegramLink
                    onClick={() => openTelegramLink("https://t.me/" + telegramLink)}
                    children={"@" + telegramLink}
                />
            </TextWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
`

const Image = styled.img.attrs({
    draggable: false,
})`
    width: 64px;
    aspect-ratio: 1;
    border-radius: 100%;
`

const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`

const Title = styled.p`
    font-size: 20px;
    font-weight: 500;
`

const TelegramLink = styled.p`
    cursor: pointer;
    color: ${(props) => props.theme.accent};
`
