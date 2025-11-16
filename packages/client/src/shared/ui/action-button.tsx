import { Icon } from "@iconify/react"
import styled from "styled-components"

type AddNewButtonProps = {
    onClick?: () => void
    label?: string
    icon?: string
    dangerous?: boolean
}

export const ActionButton = ({ onClick, icon, label, dangerous }: AddNewButtonProps) => (
    <Wrapper onClick={onClick} $dangerous={dangerous}>
        {icon && <StyledIcon icon={icon} />}
        <p children={label} />
    </Wrapper>
)

const Wrapper = styled.div<{ $dangerous?: boolean }>`
    display: flex;
    padding: 12px 16px;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: ${(props) => (props.$dangerous ? props.theme.destructive : props.theme.accent)};
`

const StyledIcon = styled(Icon).attrs(() => ({ width: 24, height: 24 }))``
