import { GroupSelect } from "@/entities/group/ui/group-select"
import { trpc } from "@/shared/api"
import { MainButton } from "@/shared/ui/main-button"
import { Page } from "@/shared/ui/page"
import { Placeholder } from "@/shared/ui/placeholder"
import { Section } from "@/shared/ui/section-deprecated"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const OnboardingPage = () => {
    const [group, setGroup] = useState<string | undefined>()
    const navigate = useNavigate()
    const utils = trpc.useUtils()

    const [showPlaceholder, setShowPlaceholder] = useState(true)

    const { mutate: selectGroup } = trpc.group.setUserGroup.useMutation({
        onSuccess: () => {
            utils.group.getUserGroup.setData(undefined, () => group)
            navigate("/")
        },
    })

    return (
        <Page backButton={false}>
            <div style={{ display: showPlaceholder ? undefined : "none" }}>
                <Placeholder
                    emoji={"wave"}
                    title={"Привет!"}
                    description={"Расписание какой группы ты хочешь знать?"}
                />
            </div>

            <Section.Body>
                <GroupSelect
                    group={group}
                    onSelect={setGroup}
                    onBlur={() => setShowPlaceholder(true)}
                    onFocus={() => setShowPlaceholder(false)}
                />
            </Section.Body>

            <MainButton
                label={"Далее"}
                disabled={group === undefined}
                onClick={() => group && selectGroup(group)}
            />
        </Page>
    )
}
