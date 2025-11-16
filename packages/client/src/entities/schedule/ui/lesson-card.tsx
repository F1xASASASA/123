import { Modal } from "@/shared/ui/modal"
import { DateTime } from "luxon"
import { useState } from "react"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import styled, { keyframes, useTheme } from "styled-components"
import { LessonView } from "./lesson-view"

const classroomWithSuffix = (classroom?: string, suffix: string = "ауд") => {
    if (!classroom) return ""
    else return classroom.length < 5 ? `${classroom} ${suffix}` : classroom
}

const formatTime = (date?: Date) => DateTime.fromJSDate(date!).toFormat("H:mm")

type LessonCardProps = {
    isSkeleton?: boolean
    title?: string
    classroom?: string
    group?: string
    startTime?: Date
    endTime?: Date
    number?: number
    teachers?: string[]
    isDistanceLearningFormat?: boolean
    cancelled?: boolean
    originalClassroom?: string
    isCurrent?: boolean
}

export const LessonCard = ({
    isSkeleton,
    title,
    classroom,
    startTime,
    endTime,
    group,
    number,
    teachers,
    isDistanceLearningFormat,
    cancelled,
    originalClassroom,
    isCurrent,
}: LessonCardProps) => {
    const theme = useTheme()

    const [isModalOpened, setIsModalOpened] = useState(false)

    console.log(startTime)

    return (
        <SkeletonTheme
            baseColor={theme.background.secondary}
            highlightColor={theme.background.primary}
        >
            <LessonItem onClick={() => setIsModalOpened(true)}>
                {isCurrent && <CurrentDot />}
                <Number children={isSkeleton ? <Skeleton width={"1rem"} /> : number} />
                {!cancelled ? (
                    <TextWrapper>
                        {!cancelled && (
                            <Secondary>
                                <ClassroomWrapper>
                                    {originalClassroom && originalClassroom !== "дистант" && (
                                        <Classroom
                                            $strikethrough={true}
                                            children={
                                                !isSkeleton &&
                                                classroomWithSuffix(originalClassroom)
                                            }
                                        />
                                    )}
                                    {isDistanceLearningFormat && (
                                        <DistanceLearningText children={"дистант"} />
                                    )}
                                    {(classroom || isSkeleton) && !isDistanceLearningFormat && (
                                        <Classroom
                                            children={!isSkeleton && classroomWithSuffix(classroom)}
                                        />
                                    )}
                                    {teachers && teachers.length > 0 && (
                                        <Teachers
                                            children={teachers
                                                .map((x) =>
                                                    x
                                                        .replace(/\(.+\)/, "")
                                                        .replace(
                                                            /([А-Яа-яA-Za-z-]+)\s([А-Яа-яA-Za-z-])[А-Яа-яA-Za-z-]+\s([А-Яа-яA-Za-z-])[А-Яа-яA-Za-z-]+/,
                                                            "$1 $2. $3.",
                                                        )
                                                        .trim(),
                                                )
                                                .join(", ")}
                                        />
                                    )}
                                    {group && <Teachers children={group} />}
                                </ClassroomWrapper>
                                <TimeWrapper>
                                    <Time children={!isSkeleton && formatTime(startTime)} />
                                    &thinsp;–&thinsp;
                                    <Time children={!isSkeleton && formatTime(endTime)} />
                                </TimeWrapper>
                            </Secondary>
                        )}
                        <Title children={isSkeleton ? <Skeleton width={"70%"} /> : title} />
                    </TextWrapper>
                ) : (
                    <Title children={"Занятие отменено"} />
                )}
            </LessonItem>
            <Modal.Wrapper isOpened={isModalOpened} onClose={() => setIsModalOpened(false)}>
                <Modal.Body>
                    <LessonView
                        title={title}
                        classroom={classroom}
                        teachers={teachers}
                        startsAt={startTime}
                        endsAt={endTime}
                    />
                </Modal.Body>
            </Modal.Wrapper>
        </SkeletonTheme>
    )
}

const LessonItem = styled.div<{ $isModified?: boolean }>`
    position: relative;
    display: flex;
    padding: 16px;
    border-radius: 16px;
    background: ${(props) => props.theme.background.primary};
    flex-direction: row;
    gap: 12px;
    cursor: pointer;
`

const DistanceLearningText = styled.p`
    color: ${(props) => props.theme.accent};
`

const TextWrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
`

const Number = styled.p`
    font-weight: 500;
    padding-top: 10px;
`

const Title = styled.p`
    display: -webkit-box;
    flex: 1;
    font-weight: 500;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
`

const Secondary = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 400;
    opacity: 0.75;
`

const TimeWrapper = styled.div`
    display: flex;
    align-items: center;
`

const Time = styled.p.attrs(({ children, ...props }) => ({
    ...props,
    children: children || <Skeleton width={"48px"} />,
}))`
    font-variant-numeric: lining-nums tabular-nums;
`

const ClassroomWrapper = styled.div`
    flex: 1;
    display: flex;
    gap: 4px;
`

const Classroom = styled.p.attrs<{ $strikethrough?: boolean }>(({ children, ...props }) => ({
    ...props,
    children: children || <Skeleton width={"32px"} />,
}))`
    min-width: max-content;
    text-decoration: ${(props) => props.$strikethrough && "line-through"};
`

const Teachers = styled.p`
    display: -webkit-box;
    max-height: 1rem;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`

const blink = keyframes`
    from {
        opacity: 1;
        scale: 1;
    }

    to {
        opacity: 0;
        scale: 4;
    }
`

const CurrentDot = styled.div`
    position: absolute;
    top: 34px;
    left: 7px;
    width: 4px;
    height: 4px;
    border-radius: 3px;
    background-color: ${(props) => props.theme.accent};

    &::before {
        position: absolute;
        content: "";
        width: 4px;
        height: 4px;
        border-radius: 3px;

        animation: ${blink} 1.5s ease-in-out infinite;
        animation-delay: 3s;

        background-color: ${(props) => props.theme.accent};
    }
`
