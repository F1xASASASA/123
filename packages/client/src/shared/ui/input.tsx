import { useCallback, useRef } from "react"
import styled from "styled-components"

type InputProps = {
    label?: string
    labelWidth?: number
    placeholder?: string
    value?: string
    onChange?: (newValue: string) => void
    onBlur?: () => void
    onFocus?: () => void
    multiline?: boolean
}

export const Input = ({
    label,
    labelWidth,
    value,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    multiline = false,
}: InputProps) => {
    const inputRef = useRef<HTMLElement>(null)

    const focus = useCallback(() => {
        inputRef.current?.focus()
    }, [])

    return (
        <Wrapper onClick={focus}>
            {label && <Label children={label} $width={labelWidth} />}
            {multiline ? (
                <StyledTextArea
                    ref={inputRef}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    onBlur={onBlur}
                    onFocus={onFocus}
                />
            ) : (
                <StyledInput
                    ref={inputRef}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    onBlur={onBlur}
                    onFocus={onFocus}
                />
            )}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    min-height: 48px;
    padding: 12px 16px;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    cursor: text;
`

const StyledInput = styled.input`
    all: unset;
    flex: 1;
`

const StyledTextArea = styled.textarea`
    all: unset;
    flex: 1;
`

const Label = styled.p<{ $width?: number }>`
    width: ${(props) => props.$width}px;
`
