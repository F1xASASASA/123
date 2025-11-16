import { DateTime } from "luxon"
import styled from "styled-components"
import { cn } from "../utils/cn"

type DateSelectProps = {
    date: Date
    selected?: boolean
    onClick?: () => void
    weekNumber?: number
}

export const DateSelect = ({ date, selected, onClick, weekNumber }: DateSelectProps) => {
    const dateTime = DateTime.fromJSDate(date)
    const diff = dateTime.diffNow().as("days")

    return (
        <div
            className={cn(
                "p-3 rounded-2xl bg-surface justify-center min-w-max cursor-pointer border border-transparent flex gap-3 items-center",
                selected && "border-accent",
            )}
            onClick={onClick}
        >
            <div className="flex flex-col">
                <p className="text-sm" children={dateTime.toFormat("d MMM").replace(".", "")} />
                <p
                    className="text-xs opacity-75"
                    children={diff < 0 ? "Сегодня" : diff < 1 ? "Завтра" : dateTime.toFormat("EEE")}
                />
            </div>
            {weekNumber !== undefined && (
                <div className="text-xs opacity-50">{weekNumber} неделя</div>
            )}
        </div>
    )
}

const DateSelectWrapper = styled.div<{ $outline?: boolean }>`
    display: flex;
    padding: 8px 16px;
    flex-direction: column;
    justify-content: center;
    border-radius: 16px;
    border: 1px solid ${(props) => (props.$outline ? props.theme.accent : "transparent")};
    background: ${(props) => props.theme.background.primary};
    align-self: stretch;
    cursor: pointer;
    transition: 0.3s border ease-in-out;
`

const Date = styled.p`
    font-size: 14px;
    font-weight: 400;
    min-width: 0;
    width: max-content;
`

const Caption = styled.p`
    opacity: 0.75;
    font-size: 12px;
    font-weight: 400;
    min-width: 0;
    width: max-content;
    text-transform: lowercase;
`
