import { trpc } from "@/shared/api"
import { DateTime } from "luxon"
import styled from "styled-components"

export const BellSchedule = () => {
    const { data } = trpc.schedule.getBellSchedule.useQuery({
        date: DateTime.now().startOf("day").toJSDate(),
    })

    return (
        <Wrapper>
            {data?.map((lesson) => (
                <Lesson key={lesson.number}>
                    <TitleLesson
                        children={
                            lesson.type === "lunch" ? "Большая перемена" : `${lesson.number} пара`
                        }
                    />
                    {lesson.attachments && lesson.attachments.length > 0 && (
                        <HalfLessonsWrapper>
                            {lesson.attachments?.map(({ time: { start, end }, number }) => (
                                <HalfLesson key={number}>
                                    <div children={DateTime.fromJSDate(start).toFormat("HH:mm")} />
                                    <div children={DateTime.fromJSDate(end).toFormat("HH:mm")} />
                                </HalfLesson>
                            ))}
                        </HalfLessonsWrapper>
                    )}
                    {lesson.type === "lunch" && (
                        <HalfLesson>
                            <div
                                children={DateTime.fromJSDate(lesson.time.start).toFormat("HH:mm")}
                            />
                            <div
                                children={DateTime.fromJSDate(lesson.time.end).toFormat("HH:mm")}
                            />
                        </HalfLesson>
                    )}
                </Lesson>
            ))}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const Lesson = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const TitleLesson = styled.p`
    padding: 0 16px;
`

const HalfLessonsWrapper = styled.div`
    display: flex;
    gap: 8px;
`

const HalfLesson = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    flex: 1;
    background-color: ${(props) => props.theme.background.primary};
    border-radius: 16px;
`
