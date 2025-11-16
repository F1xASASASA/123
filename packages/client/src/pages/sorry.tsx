import { Emoji } from "@/shared/ui/emoji"
import { MainButton, useWebApp } from "@vkruglikov/react-telegram-web-app"
import { useLocation } from "react-router-dom"

export const Sorry = () => {
    const { state } = useLocation()
    const webApp = useWebApp()

    return (
        <div className="flex h-[var(--tg-viewport-height)] -my-4 flex-col justify-center items-center gap-3 px-4 relative">
            <Emoji animationData={"duck-xray"} height={196} width={196} loop />
            <div className="flex flex-col gap-2 text-center items-center">
                <h1 className="text-2xl font-semibold" children={state.title} />
                <p className="text-primary/75" children={state.description} />
            </div>

            <p className="absolute bottom-1 text-center text-lg text-balance font-medium">
                А пока можно поотгадывать слова из пяти букв.{" "}
                <span className="text-accent">Жми кнопку ниже</span>
            </p>

            <MainButton
                onClick={() => {
                    webApp.openTelegramLink("https://t.me/fiveletters_gamebot/play?startapp=ref1")
                }}
                text="Играть"
            />
        </div>
    )
}
