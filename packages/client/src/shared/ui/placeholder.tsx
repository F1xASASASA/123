import { Emoji } from "@/shared/ui/emoji"
import styled from "styled-components"

type PlaceholderProps = {
    emoji?: any
    title?: string
    description?: string
    className?: string
    fill?: boolean
}

export const Placeholder = ({ description, emoji, title, className, fill }: PlaceholderProps) => {
    return (
        <Wrapper className={className} $fill={!!fill}>
            {emoji && <Emoji animationData={emoji} />}
            <TextWrapper>
                {title && <Title children={title} />}
                {description && <Description children={description} />}
            </TextWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div<{ $fill: boolean }>`
    display: flex;
    padding: 32px 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex: ${(props) => props.$fill && 1};
`

const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 16px;
`

const Title = styled.h1`
    text-align: center;
    font-size: 20px;
    font-weight: 700;
`

const Description = styled.p`
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    opacity: 0.8;
`
