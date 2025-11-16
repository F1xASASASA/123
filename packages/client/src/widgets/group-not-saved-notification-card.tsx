import { trpc } from "@/shared/api"
import { isGroupSaved } from "@/shared/store"
import { ActionButton } from "@/shared/ui/action-button"
import { Section } from "@/shared/ui/section-deprecated"
import { useRecoilState } from "recoil"
import styled from "styled-components"

export const GroupNotSavedNotificationCard = () => {
    const utils = trpc.useUtils()
    const [groupName, setGroupName] = useRecoilState(isGroupSaved)

    const { mutate } = trpc.group.setUserGroup.useMutation({
        onSuccess: () => {
            if (typeof groupName !== "string") return
            setGroupName(false)
            utils.group.getUserGroup.setData(undefined, () => groupName)
        },
    })

    if (typeof groupName !== "string") return

    return (
        <Section.Body>
            <Title>
                Сохранить группу <b>{groupName}</b> как свою?
            </Title>
            <ActionButton
                label={"Сохранить"}
                onClick={() => {
                    mutate(groupName)
                }}
            />
            <ActionButton
                label={"Вернуться к своей группе"}
                onClick={() => {
                    utils.group.getUserGroup.refetch()
                    setGroupName(false)
                }}
            />
        </Section.Body>
    )
}

const Title = styled.p`
    font-size: 16px;
    padding: 12px 16px;
`
