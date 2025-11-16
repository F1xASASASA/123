import * as Sentry from "@sentry/react"

Sentry.init({
    dsn: "https://a22499ffc09b2cc85d9deb8b64806eea@o4506860200984576.ingest.us.sentry.io/4506860253741056",
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
        }),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ["localhost"],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
})

import { Router } from "@/app/router"
import { trpc } from "@/shared/api"
import useHeaderColor from "@/shared/hooks/useHeaderColor"
import { ErrorFallback } from "@/shared/ui/error-fallback"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/react-query"
import {
    WebAppProvider,
    useInitData,
    useThemeParams,
    useWebApp,
} from "@vkruglikov/react-telegram-web-app"
import { Settings } from "luxon"
import moment from "moment"
import "moment/dist/locale/ru"
import { Suspense, useEffect, useMemo } from "react"
import { createRoot } from "react-dom/client"
import { ErrorBoundary } from "react-error-boundary"
import "react-loading-skeleton/dist/skeleton.css"
import { BrowserRouter, useNavigate } from "react-router-dom"
import { RecoilRoot } from "recoil"
import { DefaultTheme, ThemeProvider } from "styled-components"
import superjson from "superjson"
import "./styles.css"

moment.locale("ru")

Settings.defaultLocale = "ru"
Settings.defaultZone = "Asia/Yekaterinburg"

const queryClient = new QueryClient()

export const App = () => {
    const [, initData] = useInitData()
    const [colorScheme, colors] = useThemeParams()

    const webApp = useWebApp()

    const navigate = useNavigate()

    useEffect(() => {
        webApp.SettingsButton.show()

        const callback = () => navigate("/settings")

        webApp.onEvent("settingsButtonClicked", callback)

        return () => webApp.offEvent("settingsButtonClicked", callback)
    }, [navigate, webApp])

    const trpcClient = useMemo(
        () =>
            trpc.createClient({
                links: [
                    httpBatchLink({
                        transformer: superjson,
                        url: import.meta.env.VITE_API_URL || "/api",
                        headers: {
                            Authorization: initData,
                            "bypass-tunnel-reminder": "Yes",
                        },
                    }),
                ],
            }),
        [initData],
    )

    useEffect(() => {
        document.getElementById("loader")?.remove()

        if (colorScheme === "dark") {
            document.body.classList.add("dark")
        } else {
            document.body.classList.remove("dark")
        }
    })

    const theme: DefaultTheme = useMemo(() => {
        const isDark = colorScheme === "dark"

        return {
            background: {
                primary: isDark ? "#1C1C1C" : "#FFFFFF",
                secondary: isDark ? "#000000" : "#F1F1F1",
            },
            text: isDark ? "#ffffff" : "#000000",
            accent: colors.button_color ?? "#007aff",
            onAccent: colors.button_text_color ?? "#ffffff",
            // @ts-expect-error colors have destructive_text_color
            destructive: colors.destructive_text_color ?? "#ff453a",
        }
    }, [colorScheme, colors])

    useHeaderColor(() => theme.background.secondary)

    return (
        <ThemeProvider theme={theme}>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <Suspense>
                        <Router />
                    </Suspense>
                </QueryClientProvider>
            </trpc.Provider>
        </ThemeProvider>
    )
}

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary fallbackRender={ErrorFallback}>
        <RecoilRoot>
            <BrowserRouter>
                <WebAppProvider options={{ smoothButtonsTransition: true }}>
                    <App />
                </WebAppProvider>
            </BrowserRouter>
        </RecoilRoot>
    </ErrorBoundary>,
)
