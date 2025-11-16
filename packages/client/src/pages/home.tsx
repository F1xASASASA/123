import { trpc } from "@/shared/api"
import { isGroupSaved } from "@/shared/store"
import { Emoji } from "@/shared/ui/emoji"
import { Page } from "@/shared/ui/page"
import { Title } from "@/shared/ui/title"
import { EasterEgg } from "@/widgets/easter-egg"
import { GroupNotSavedNotificationCard } from "@/widgets/group-not-saved-notification-card"
import { Schedule } from "@/widgets/schedule"
import { Timer } from "@/widgets/timer"
import { MainButton, useWebApp } from "@vkruglikov/react-telegram-web-app"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"

export const HomePage = () => {
    const navigate = useNavigate()
    const { data: userGroup, isSuccess } = trpc.group.getUserGroup.useQuery()
    const { data: healthcheck } = trpc.healthcheck.useQuery()
    const isGroupSavedValue = useRecoilValue(isGroupSaved)

    useEffect(() => {
        if (userGroup || !isSuccess) return

        navigate("/onboarding", { replace: true })
    }, [isSuccess, navigate, userGroup])

    useEffect(() => {
        if (healthcheck?.isTechnicalWork) navigate("/sorry", { replace: true, state: healthcheck })
    }, [healthcheck, navigate])

    const webApp = useWebApp()

    return (
        <Page>
            {window.location.hostname === "schedule.layxl.dev" ? (
                <div className="flex h-[var(--tg-viewport-height)] -my-4 flex-col justify-center items-center gap-3 px-4">
                    <Emoji animationData={"duck-chipi-chapa"} height={196} width={196} loop />
                    <div className="flex flex-col gap-2 text-center items-center">
                        <h1 className="text-2xl font-semibold">Приложение переехало</h1>
                        <p className="text-primary/75">
                            Мы украли{" "}
                            <span
                                onClick={() => webApp.openTelegramLink("https://t.me/midis_bot")}
                                className="text-accent"
                            >
                                @midis_bot
                            </span>{" "}
                            и&nbsp;<i>запустили</i> приложеньку там. Извиняй за неудобство,
                            но&nbsp;придется <i>перейти</i> в&nbsp;новый апп!
                        </p>
                    </div>

                    <MainButton
                        text="Замётано!"
                        onClick={() => {
                            webApp.openTelegramLink("https://t.me/midis_bot")
                        }}
                    />
                </div>
            ) : (
                <>
                    <EasterEgg />
                    <Title />
                    {isGroupSavedValue !== true && <GroupNotSavedNotificationCard />}
                    <Timer keepToGroupsSchedule={true} />
                    <Schedule />
                </>
            )}
        </Page>
    )
}
