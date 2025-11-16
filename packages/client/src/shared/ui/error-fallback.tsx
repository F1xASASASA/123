import styled, { createGlobalStyle } from "styled-components"

type ErrorFallbackProps = {
    error: {
        message: string
        line: number
        column: number
        sourceURL: string
        stack: string
    }
    resetErrorBoundary: () => void
}

export const ErrorFallback = ({ error }: ErrorFallbackProps) => {
    // @ts-expect-error Telegram is exists
    const button = window.Telegram.WebApp.MainButton

    button.text = "Сообщить об ошибке"

    button.onClick(() => {
        window.Telegram.WebApp.openTelegramLink("https://t.me/vvvlay")
    })

    button.show()

    return (
        <>
            <GlobalStyles />
            <Wrapper>
                <Title>Произошла ошибка</Title>

                <Code
                    readOnly={true}
                    onClick={(e) => e.target.select()}
                    value={`${error.message}
                    ${error.line}:${error.column}
                    ${error.sourceURL}
                    ${error.stack}`}
                />
            </Wrapper>
        </>
    )
}

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -ms-overflow-style: none; 
        scrollbar-width: none; 
        &::-webkit-scrollbar {
            display: none;
        }
    }
    
    body {
        background-color: var(--tg-theme-bg-color);
        color: var(--tg-theme-text-color);
        font-size: 16px;
        font-family: -apple-system, sans-serif;
        /* user-select: none; */
        /* -webkit-user-select: none; */
        /* -webkit-touch-callout: none; */
        /* -webkit-tap-highlight-color: rgba(0,0,0,0); */
    }
`

const Wrapper = styled.div`
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
`

const Title = styled.h1`
    text-align: center;
    font-size: 20px;
`

const Code = styled.textarea`
    all: unset;
    font-family: "Courier New", Courier, monospace;
    background-color: var(--tg-theme-secondary-bg-color);
    padding: 16px;
    height: 75vh;
    width: 100%;
`
