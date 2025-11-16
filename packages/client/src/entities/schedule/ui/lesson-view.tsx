import { SecondaryTimer } from "@/features/timer/ui/secondary-timer"
import { Modal } from "@/shared/ui/modal"
import { Section } from "@/shared/ui/section-deprecated"
import { DateTime } from "luxon"
import { useMemo } from "react"
import styled from "styled-components"

type LessonViewProps = {
    title?: string
    classroom?: string
    teachers?: string[]
    startsAt?: Date
    endsAt?: Date
}

export const LessonView = ({ title, classroom, teachers, startsAt, endsAt }: LessonViewProps) => {
    const classroomDescription = useMemo(() => {
        if (classroom === "дистант") return "Занятие пройдёт дистанционно"

        if (classroom === "Актовый зал") return `Занятие пройдёт в актовом зале`

        if (classroom?.search(/\d{2,}[А-Яа-я]/)) return `Занятие пройдёт в ${classroom} аудитории`

        return `Занятие пройдёт в ${classroom} ауд`
    }, [classroom])

    return (
        <>
            {title && <Modal.Title title={title} />}

            <p children={classroomDescription} />

            {teachers?.map((teacher) => (
                <p key={teacher} children={teacher.replace(/\s\(.+\)/, "")} />
            ))}

            <StyledBody type="secondary">
                {startsAt && (
                    <TimerWrapper>
                        <SecondaryTimer
                            withoutPadding={true}
                            title={"Начало пары"}
                            duration={DateTime.fromJSDate(startsAt).diffNow().negate().toMillis()}
                        />
                    </TimerWrapper>
                )}

                {endsAt && (
                    <TimerWrapper>
                        <SecondaryTimer
                            withoutPadding={true}
                            title={"Конец пары"}
                            duration={DateTime.fromJSDate(endsAt).diffNow().negate().toMillis()}
                        />
                    </TimerWrapper>
                )}
            </StyledBody>
        </>
    )
}

const TimerWrapper = styled.div`
    padding: 16px;
`

const StyledBody = styled(Section.Body)`
    margin: 0 -16px;
`
