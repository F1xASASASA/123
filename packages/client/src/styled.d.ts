import "styled-components"

declare module "styled-components" {
    export interface DefaultTheme {
        background: {
            primary: string
            secondary: string
        }
        text: string
        accent: string
        onAccent: string
        destructive: string
    }
}

declare module "react" {
    interface CSSProperties {
        [key: `--${string}`]: string | number
    }
}
