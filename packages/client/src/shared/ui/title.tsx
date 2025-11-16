import { GroupSelect } from "@/entities/group/ui/group-select"
import { Greetings } from "@/widgets/greetings"
import { Icon } from "@iconify/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCloudStorage, useWebApp } from "@vkruglikov/react-telegram-web-app"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import styled from "styled-components"
import { trpc } from "../api"
import useHapticFeedback from "../hooks/useHapticFeedback"
import { isEasterEggActivated, isGroupSaved } from "../store"

export const Title = () => {
    const webApp = useWebApp()
    const utils = trpc.useUtils()
    const { data: selectedGroup } = trpc.group.getUserGroup.useQuery()
    const cloudStorage = useCloudStorage()
    const queryClient = useQueryClient()
    const { data: isTelegramChannelAdShow } = useQuery({
        queryKey: ["isTelegramChannelAdShown", "get"],
        queryFn: async () => (await cloudStorage.getItem("isTelegramChannelAdShown")) !== "true",
    })
    const { mutate: hideTelegramChannelAd } = useMutation({
        mutationKey: ["isTelegramChannelAdShown", "set"],
        mutationFn: async () => cloudStorage.setItem("isTelegramChannelAdShown", "true"),
        onMutate: () => queryClient.setQueryData(["isTelegramChannelAdShown", "get"], () => false),
    })
    const setGroupSaved = useSetRecoilState(isGroupSaved)
    const { notificationOccurred } = useHapticFeedback()
    const navigate = useNavigate()
    const setGroup = useCallback(
        (group: string) => {
            utils.group.getUserGroup.setData(undefined, () => group)
            setGroupSaved(selectedGroup !== group ? group : true)
        },
        [selectedGroup, setGroupSaved, utils.group.getUserGroup],
    )

    const [counter, setCounter] = useState(0)
    const setIsEasterEggActivated = useSetRecoilState(isEasterEggActivated)

    useEffect(() => {
        if (counter === 3) {
            setIsEasterEggActivated(true)
            setCounter(0)
        }
    }, [counter, setIsEasterEggActivated])

    return (
        <>
            <TitleWrapper>
                <Greetings />
                <TitleText
                    onClick={() => {
                        setCounter(counter + 1)
                        notificationOccurred("warning")
                    }}
                    children={"Расписание"}
                />
                <IconButton onClick={() => navigate("/bells")} icon={"mdi:clock-outline"} />
                <GroupSelectWrapper>
                    <GroupSelect
                        withPlaceholder={false}
                        group={selectedGroup ?? ""}
                        onSelect={setGroup}
                    />
                </GroupSelectWrapper>
            </TitleWrapper>
            {isTelegramChannelAdShow &&
                (selectedGroup?.toUpperCase().includes("ПИ-") ||
                    selectedGroup?.toUpperCase().includes("П-")) && (
                    <div
                        className="bg-surface p-4 rounded-2xl flex flex-col gap-3"
                        onClick={() => {
                            webApp.openTelegramLink("https://t.me/secretscode")
                            hideTelegramChannelAd()
                        }}
                    >
                        <div className="flex flex-col gap-2 relative">
                            <div
                                className="absolute top-0 right-0 p-1 bg-primary rounded-full cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    hideTelegramChannelAd()
                                }}
                            >
                                <Icon icon={"ic:round-close"} />
                            </div>
                            <h1 className="font-semibold text-xl flex items-center gap-1">
                                Веб-разработчик?{" "}
                                <img
                                    className="inline h-6"
                                    src="/man.png"
                                    alt=""
                                    draggable={false}
                                />
                            </h1>
                            <div className="flex gap-1 items-end">
                                <p className="flex-1 text-balance">
                                    Советую заглянуть в&nbsp;канал про&nbsp;веб-дев
                                    от&nbsp;разработчика этого&nbsp;бота
                                </p>
                                <div className="p-2 w-24 bg-accent rounded-xl flex justify-center cursor-pointer">
                                    <span>Открыть</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </>
    )
}

const TitleWrapper = styled.div`
    position: relative;
    display: flex;
    padding: 0 0 0 16px;
    align-items: center;
    gap: 10px;
`

const TitleText = styled.h1`
    flex: 1;
    color: ${(props) => props.theme.text};
    font-size: 24px;
    font-weight: 700;
`

const GroupSelectWrapper = styled.div`
    max-width: 136px;
    width: 100%;
    background-color: ${(props) => props.theme.background.primary};
    border-radius: 16px;
`

const IconButton = styled(Icon).attrs((attrs) => ({
    ...attrs,
    width: 24,
    height: 24,
}))`
    padding: 12px;
    box-sizing: content-box;
    border-radius: 12px;
    background: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.text};
    cursor: pointer;
`
