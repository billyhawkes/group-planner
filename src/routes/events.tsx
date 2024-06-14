import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";

export const Route = createFileRoute("/events")({
	component: Events,
});

function Events() {
	const daysThisMonth = dayjs().daysInMonth();

	return (
		<div className="grid grid-cols-7 flex-1 gap-[1px] bg-[#ccc]">
			{Array.from({ length: daysThisMonth }).map((_, i) => (
				<div key={i} className="flex-1å p-4 bg-white">
					<p>{i}</p>
				</div>
			))}
			{Array.from({ length: 7 - (daysThisMonth % 7) }).map((_, i) => (
				<div key={i} className="flex-1 p-4 bg-white"></div>
			))}
		</div>
	);
}
