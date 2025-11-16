import humanizeDuration from "humanize-duration"
import styled from "styled-components"

type SecondaryTimerProps = {
    title: string
    duration: number
    withoutPadding?: boolean
}

export const SecondaryTimer = ({
    title,
    duration,
    withoutPadding = false,
}: SecondaryTimerProps) => {
    return (
        <TimerItem $withoutPadding={withoutPadding}>
            <Text children={title} />
            <Time
                children={
                    humanizeDuration(duration, {
                        delimiter: " ",
                        round: true,
                        units: ["h", "m"],
                        language: "ru",
                    })
                        .replace(/час[а-я]*/, "ч")
                        .replace(/мин[а-я]*/, "мин") + (duration > 0 ? " назад" : "")
                }
            />
        </TimerItem>
    )
}

const TimerItem = styled.div<{ $withoutPadding: boolean }>`
    display: flex;
    padding: 0px 16px;
    ${(props) => props.$withoutPadding && "padding: 0px;"}
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
`

const Text = styled.p`
    flex: 1;
`

const Time = styled.p`
    color: ${(props) => props.theme.accent};
    font-weight: 500;
    font-variant-numeric: lining-nums tabular-nums;
`
