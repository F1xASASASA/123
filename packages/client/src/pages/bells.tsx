import { Page } from "@/shared/ui/page"
import { BellSchedule } from "@/widgets/bell-schedule"
import { Timer } from "@/widgets/timer"

export const BellsPage = () => {
    return (
        <Page>
            <Timer keepToGroupsSchedule={false} />
            <BellSchedule />
        </Page>
    )
}
