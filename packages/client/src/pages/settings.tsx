import firstImage from "@/assets/1.webp"
import heart from "@/assets/heart.png"
import { ChevronItem } from "@/shared/ui/chevron-item"
import { OwnerCard } from "@/shared/ui/owner-card"
import { Page } from "@/shared/ui/page"
import { Section } from "@/shared/ui/section-deprecated"
import { Switcher } from "@/shared/ui/switcher"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCloudStorage } from "@vkruglikov/react-telegram-web-app"
import { useNavigate } from "react-router-dom"

export const SettingsPage = () => {
    const navigate = useNavigate()
    const { setItem, getItem } = useCloudStorage()
    const queryClient = useQueryClient()

    const { data: isTimerWithFeedback, isSuccess: isLoadedSettingIsTimerWithFeedback } = useQuery({
        queryKey: ["isTimerWithFeedback", "get"],
        queryFn: async () => (await getItem("isTimerWithFeedback")) === "true",
    })

    const { mutate } = useMutation({
        mutationKey: ["isTimerWithFeedback", "set"],
        mutationFn: async (state: boolean) => {
            queryClient.setQueryData(["isTimerWithFeedback", "get"], state)

            return await setItem("isTimerWithFeedback", String(state))
        },
    })

    return (
        <Page>
            <Section.Wrapper>
                <Section.Body>
                    <ChevronItem label={"Статистика"} onClick={() => navigate("/statistics")} />
                </Section.Body>
            </Section.Wrapper>

            <Section.Wrapper>
                <Section.Body>
                    {isLoadedSettingIsTimerWithFeedback && (
                        <ChevronItem label={"Тактильный отклик в таймере"} withChevron={false}>
                            <Switcher
                                state={isTimerWithFeedback}
                                onChangeState={() => {
                                    mutate(!isTimerWithFeedback)
                                }}
                            />
                        </ChevronItem>
                    )}
                </Section.Body>
            </Section.Wrapper>

            <Section.Wrapper>
                <Section.Header children={"Разработчик приложения"} />
                <Section.Body>
                    <OwnerCard image={firstImage} title={"Виталя"} telegramLink={"secretscode"} />
                </Section.Body>
                <Section.Footer className="flex gap-1">
                    Сделал с <img src={heart} width={16} draggable={false} />
                </Section.Footer>
            </Section.Wrapper>
        </Page>
    )
}
