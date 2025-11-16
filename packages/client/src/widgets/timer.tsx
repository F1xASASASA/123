import { SecondaryTimer } from "@/features/timer/ui/secondary-timer"
import { trpc } from "@/shared/api"
import { MainTimer } from "@/shared/ui/main-timer"
import { DateTime } from "luxon"
import { useEffect, useMemo, useState } from "react"
import styled from "styled-components"

type TimerProps = {
    keepToGroupsSchedule: boolean
}

export const Timer = ({ keepToGroupsSchedule }: TimerProps) => {
    const { data: userGroup } = trpc.group.getUserGroup.useQuery()

    const { data } = trpc.schedule.getTimers.useQuery({
        date: DateTime.now().startOf("day").toJSDate(),
        groupName: keepToGroupsSchedule ? userGroup! : undefined,
    })

    const [currentTime, setCurrentTime] = useState(DateTime.now())

    const filteredTimers = useMemo(
        () =>
            data
                ?.map((x) => ({
                    ...x,
                    duration: currentTime.diff(DateTime.fromJSDate(x.time)).toMillis(),
                }))
                .filter((x) => x.duration < 0),
        [currentTime, data],
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(DateTime.now())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {(filteredTimers ?? [])[0]?.duration && (
                <MainTimer
                    title={(filteredTimers ?? [])[0]?.mainTimerTitle}
                    duration={(filteredTimers ?? [])[0]?.duration}
                />
            )}
            {(filteredTimers?.length ?? 0) > 1 && (
                <TimerListWrapper>
                    {filteredTimers?.slice(1, 4).map((timer) => (
                        <SecondaryTimer
                            key={timer.mainTimerTitle}
                            title={timer.secondaryTimerTitle}
                            duration={timer.duration}
                        />
                    ))}
                </TimerListWrapper>
            )}
        </>
    )
}

const TimerListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
`
