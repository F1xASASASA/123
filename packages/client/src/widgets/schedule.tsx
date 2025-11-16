import { Shrovetide2024 } from "@/entities/commercial/ui/shrovetide-2024";
import { LessonCard } from "@/entities/schedule/ui/lesson-card";
import { RouterOutput, trpc } from "@/shared/api";
import useHapticFeedback from "@/shared/hooks/useHapticFeedback";
import { DateSelect } from "@/shared/ui/date-select";
import { Placeholder } from "@/shared/ui/placeholder";
import { Section } from "@/shared/ui/section-deprecated";
import { isTeacher } from "@/shared/utils/isTeacher";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { motion } from "framer-motion";
import { DateTime, Interval } from "luxon";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";

// TODO
function removeDuplicateClasses<T>(classes: T[]): T[] {
	return classes;
	// const seenNumbers: { [key: number]: boolean } = {}
	// const filteredClasses: T[] = []

	// for (const cls of classes) {
	//     // @ts-expect-error classroom and number is exists
	//     if (cls.classroom !== undefined || !(cls.number in seenNumbers)) {
	//         filteredClasses.push(cls)
	//         // @ts-expect-error number is exists
	//         seenNumbers[cls.number] = true
	//     }
	// }

	// return filteredClasses
}

export const Schedule = () => {
	const [dates] = useState(
		Array.from({
			length: 14,
		})
			.map((_, i) => DateTime.now().plus({ days: i }).startOf("day"))
			.filter((day) => day.weekday !== 7)
			.map((day) => day.toJSDate()),
	);

	const { openTelegramLink } = useWebApp();
	const { impactOccurred, notificationOccurred } = useHapticFeedback();

	const [selectedDate, setSelectedDate] = useState(
		DateTime.now().hour > 20 ? dates[1] : dates[0],
	);

	const { data: userGroup } = trpc.group.getUserGroup.useQuery();

	const isTeacherValue = isTeacher(userGroup);

	const { data, isError, isSuccess, isLoading } =
		trpc.schedule.getSchedule.useQuery(
			{
				date: selectedDate,
				groupName: userGroup ?? "",
			},
			{
				retry: 0,
			},
		);

	const { data: updatedAt, isLoading: isLoadingUpdatedAt } =
		trpc.schedule.getScheduleUpdateTime.useQuery();

	const filteredData = useMemo(() => {
		if (!isSuccess) return [];

		const newData = removeDuplicateClasses(data);

		if (
			DateTime.fromJSDate(selectedDate).equals(
				DateTime.fromObject({
					day: 14,
					month: 3,
					year: 2024,
				}),
			)
		) {
			const i = newData.findIndex((x) => x.number === 4);

			newData.splice(i > 0 ? i : newData.length, 0, {
				type: "shrovetide-2024",
			});
		}

		return removeDuplicateClasses(data) as (
			| RouterOutput["schedule"]["getSchedule"][0]
			| { type: string }
		)[];
	}, [data, isSuccess, selectedDate]);

	useEffect(() => {
		if (!isSuccess || data?.length !== 0) return;

		notificationOccurred("success");
	}, [data?.length, isSuccess, notificationOccurred]);

	return (
		<>
			<div className="overflow-y-scroll flex gap-2 px-4">
				{dates.map((date, i) => (
					<DateSelect
						weekNumber={
							i === 0 || date.getDay() === 1
								? DateTime.fromJSDate(date).weekNumber % 2 === 0
									? 2
									: 1
								: undefined
						}
						key={date.toString()}
						date={date}
						selected={selectedDate === date}
						onClick={() => {
							setSelectedDate(date);
							impactOccurred("soft");
						}}
					/>
				))}
			</div>
			<Lessons>
				{isSuccess &&
					filteredData.map((item, index) =>
						"type" in item ? (
							item.type === "shrovetide-2024" && <Shrovetide2024 />
						) : (
							<LessonCard
								isDistanceLearningFormat={
									item.classroom?.toLowerCase() === "дистант"
								}
								title={item.subject}
								number={item.number}
								group={item.group}
								teachers={item.teachers}
								classroom={item.classroom}
								originalClassroom={item.original?.classroom}
								startTime={item.startsAt}
								cancelled={item.cancelled}
								endTime={item.endsAt}
								key={index}
								isCurrent={
									item.startsAt &&
									item.endsAt &&
									Interval.fromDateTimes(item.startsAt, item.endsAt).contains(
										DateTime.now(),
									)
								}
							/>
						),
					)}
				{isSuccess && data.length === 0 && (
					<motion.div
						initial={{ opacity: 0, translateY: "50%" }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{
							bounce: false,
							type: "spring",
						}}
					>
						<Section.Body>
							<Placeholder
								emoji={"party"}
								title={"В этот день нет занятий"}
								description={"Можно радоваться!"}
							/>
						</Section.Body>
					</motion.div>
				)}
				{isLoading &&
					Array.from({ length: 4 }).map((_, i) => (
						<LessonCard key={i} isSkeleton={true} />
					))}
				{isError && (
					<Section.Body>
						<Placeholder
							emoji={"chocolate"}
							title={"Технические шоколадки"}
							description={
								"Мы не смогли получить расписание. Возможно, этой группы не существует"
							}
						/>
					</Section.Body>
				)}
				<Section.Footer>
					{isLoadingUpdatedAt ? (
						<Skeleton width={"40%"} />
					) : (
						`Обновлено ${moment(updatedAt).fromNow()}`
					)}
				</Section.Footer>
				<Section.Footer>
					Если возникли проблемы, то обращайся к&nbsp;
					<StyledLink onClick={() => openTelegramLink("https://t.me/vvvlay")}>
						@vvvlay
					</StyledLink>
				</Section.Footer>
			</Lessons>
		</>
	);
};

const StyledLink = styled.span`
    color: ${(props) => props.theme.accent};
`;

const Lessons = styled.div`
    margin-top: -8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: var(--tg-viewport-height);
`;
