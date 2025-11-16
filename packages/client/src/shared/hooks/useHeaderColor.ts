import { ThemeParams, useThemeParams, useWebApp } from "@vkruglikov/react-telegram-web-app"
import { useEffect } from "react"

export default (callback: (themeParams: ThemeParams) => string | undefined) => {
    const webApp = useWebApp()
    const [, themeParams] = useThemeParams()

    const color = callback(themeParams)

    useEffect(() => {
        if (!color) return

        try {
            webApp.setHeaderColor(color)
        } catch (e) {
            console.log(e)
        }
    }, [color, webApp])
}
