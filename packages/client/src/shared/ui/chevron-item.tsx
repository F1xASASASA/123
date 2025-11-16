import { Icon } from "@iconify/react"
import { ReactNode } from "react"
import styled from "styled-components"

type ChevronItemProps = {
    label?: string
    secondaryLabel?: string
    withChevron?: boolean
    onClick?: () => void
    children?: ReactNode
}

export const ChevronItem = ({
    onClick,
    label,
    secondaryLabel,
    withChevron = true,
    children,
}: ChevronItemProps) => {
    return (
        <Wrapper onClick={onClick}>
            <Label children={label} />
            <RightSide>
                {children}
                {secondaryLabel && <SecondaryLabel children={secondaryLabel} />}
                {withChevron && <StyledChevron icon={"ic:round-chevron-right"} />}
            </RightSide>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    height: 48px;
    padding: 12px 16px;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    cursor: pointer;
`

const Label = styled.p`
    flex: 1;
`

const RightSide = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

const SecondaryLabel = styled.p`
    opacity: 0.5;
`

const StyledChevron = styled(Icon)`
    width: 18px;
    height: 18px;
    opacity: 0.5;
`
