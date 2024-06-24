import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { testUsers } from "@/lib/data";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/$groupId/_layout/events")({
	component: Events,
});

const testEvents = [
	{
		id: 1,
		title: "Brandons BBQ",
		description: "This is a test event",
		start: dayjs().add(1, "hour").toDate(),
		end: dayjs().add(2, "hour").toDate(),
	},
];

function Events() {
	const [current, setCurrent] = useState(dayjs());
	const daysThisMonth = current.daysInMonth();
	const datesInMonth = Array.from({ length: daysThisMonth }).map((_, i) => {
		return current.date(i + 1);
	});
	const startDay = current.startOf("month").day();
	const dateFormatted = current.format("MMMM") + " " + current.format("YYYY");

	const fillerBoxes = Array.from({ length: 7 - ((daysThisMonth + startDay) % 7) });

	return (
		<div className="flex-1 flex flex-col -mt-8">
			<div className="flex gap-2">
				<Button
					size={"icon"}
					variant={"outline"}
					onClick={() => setCurrent(current.subtract(1, "month"))}
				>
					<ChevronLeft size={20} />
				</Button>
				<Button
					size={"icon"}
					variant={"outline"}
					onClick={() => setCurrent(current.add(1, "month"))}
				>
					<ChevronRight size={20} />
				</Button>
				<Button variant={"outline"} onClick={() => setCurrent(dayjs())}>
					Today
				</Button>
				<h2>{dateFormatted}</h2>
			</div>
			<hr className="mt-4" />
			<div className="grid grid-cols-7">
				{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
					<div key={day} className="p-4 bg-white">
						<p>{day}</p>
					</div>
				))}
			</div>
			<div className="grid grid-cols-7 flex-1 gap-[1px] bg-[#ccc]">
				{Array.from({ length: startDay }).map((_, i) => (
					<div key={i} className="flex-1 p-4 bg-white"></div>
				))}
				{datesInMonth.map((day, i) => (
					<div key={i} className="flex-1 p-4 bg-white">
						<p>{day.date()}</p>
						{testEvents
							.filter((event) => day.isSame(event.start, "day"))
							.map((event) => (
								<Sheet>
									<SheetTrigger asChild>
										<div
											key={event.id}
											className="bg-muted rounded p-2 cursor-pointer"
										>
											<p className="text-sm text-muted-foreground">
												{dayjs(event.start).format("h:mm A")} -{" "}
												{dayjs(event.end).format("h:mm A")}
											</p>
											<p>{event.title}</p>
										</div>
									</SheetTrigger>
									<SheetContent>
										<SheetHeader className="flex flex-col space-y-0 gap-4">
											<h2>{event.title}</h2>
											<p className="text-sm text-muted-foreground">
												{dayjs(event.start).format("h:mm A")} -{" "}
												{dayjs(event.end).format("h:mm A")}
											</p>
											<p className="text-sm text-muted-foreground">
												{event.description}
											</p>
											<hr />
											<div className="flex justify-between gap-2">
												<Button variant={"outline"} className="flex-1">
													Accept
												</Button>
												<Button variant={"outline"} className="flex-1">
													Decline
												</Button>
											</div>
											<p className="text-muted-foreground text-sm tracking-widest">
												MEMBERS
											</p>
											{testUsers.map((user, i) => (
												<div key={i} className="flex gap-2 items-center">
													<div className="bg-muted rounded-full w-8 h-8 flex justify-center items-center">
														<User size={18} />
													</div>
													<div className="flex flex-col gap-0">
														<p className="font-medium">{user.name}</p>
														<p
															className={cn(
																"text-xs",
																user.status === "online"
																	? "text-green-600"
																	: "text-muted-foreground"
															)}
														>
															{user.status === "online"
																? "Accepted"
																: "Declined"}
														</p>
													</div>
												</div>
											))}
										</SheetHeader>
									</SheetContent>
								</Sheet>
							))}
					</div>
				))}
				{fillerBoxes.length !== 7 &&
					fillerBoxes.map((_, i) => <div key={i} className="flex-1 p-4 bg-white"></div>)}
			</div>
		</div>
	);
}
