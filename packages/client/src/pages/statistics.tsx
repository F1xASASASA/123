import { trpc } from "@/shared/api"
import { Counter } from "@/shared/ui/counter"
import { Page } from "@/shared/ui/page"
import styled from "styled-components"

export const StatisticsPage = () => {
    const { data, isSuccess } = trpc.getStats.useQuery()

    return (
        <CenteredPage>
            {isSuccess && <Counter count={data?.allUsers} label={"Всего пользователей"} />}
            {isSuccess && <Counter count={data?.todayUsers} label={"Пользователей за день"} />}
            {isSuccess && data.currentUsers >= 3 && (
                <Counter count={data?.currentUsers} label={"Онлайн"} />
            )}
        </CenteredPage>
    )
}

const CenteredPage = styled(Page)`
    justify-content: center;
`
