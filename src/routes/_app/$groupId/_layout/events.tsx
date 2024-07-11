import Member from "@/components/Member";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { CreateEventSchema } from "@/lib/types";
import { api, apiUtils } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/_app/$groupId/_layout/events")({
	component: Events,
});

// Create schema for the event creation form
const CreateEventFormSchema = CreateEventSchema.extend({
	startsAt: z.string().min(1, {
		message: "Start date is required",
	}),
	endsAt: z.string().min(1, {
		message: "End date is required",
	}),
});
type CreateEventForm = z.infer<typeof CreateEventFormSchema>;

// Dialog that holds the event form
const CreateEventDialog = ({ groupId }: { groupId: string }) => {
	// Open/close state for the dialog (allows manually closing on creation)
	const [open, setOpen] = useState(false);

	// Initialize the form and default form values
	const form = useForm<CreateEventForm>({
		resolver: zodResolver(CreateEventFormSchema),
		defaultValues: {
			name: "",
			description: undefined,
			startsAt: "",
			endsAt: "",
		},
	});

	// Create the event mutation
	const { mutate } = api.events.create.useMutation({
		onSuccess: () => {
			// Invalidate the events query to refetch the data
			apiUtils.events.find.invalidate({
				groupId,
			});
			// Reset the form to default values and close the dialog
			form.reset();
			setOpen(false);
		},
	});

	// On form submit, call the event creation mutation
	const onSubmit = (values: CreateEventForm) => {
		mutate({
			...values,
			groupId,
			startsAt: new Date(values.startsAt),
			endsAt: new Date(values.endsAt),
		});
	};

	return (
		// Dialog component that holds the form and attaches the open/close state
		<Dialog open={open} onOpenChange={setOpen}>
			{/* Dialog trigger that opens the dialog when clicked */}
			<DialogTrigger asChild>
				<Button className="gap-2">
					<CalendarPlus size={17} />
					Create Event
				</Button>
			</DialogTrigger>
			<DialogContent>
				{/* Dialog header with title and description explaining the form */}
				<DialogHeader>
					<DialogTitle>Create Event</DialogTitle>
					<DialogDescription>
						Fill out the form below to create an event.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Event name field */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Event description field */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Event starts at field */}
						<FormField
							control={form.control}
							name="startsAt"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Start</FormLabel>
									<FormControl>
										<input
											name="startsAt"
											value={field.value}
											onChange={field.onChange}
											aria-label="Date and time"
											type="datetime-local"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Event ends at field */}
						<FormField
							control={form.control}
							name="endsAt"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>End</FormLabel>
									<FormControl>
										<input
											name="endsAt"
											value={field.value}
											onChange={field.onChange}
											aria-label="Date and time"
											type="datetime-local"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Submit button */}
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

function Events() {
	// Get the group ID from the route params
	const { groupId } = Route.useParams();

	// Query for events in the group
	const { data: events } = api.events.find.useQuery({
		groupId,
	});

	// State for map
	const [current, setCurrent] = useState(dayjs()); // Current day
	const daysThisMonth = current.daysInMonth(); // Days in current month
	const datesInMonth = Array.from({ length: daysThisMonth }).map((_, i) => {
		return current.date(i + 1);
	}); // Array of each day in the month
	const startDay = current.startOf("month").day(); // Day of the week the month starts on
	const dateFormatted = current.format("MMMM") + " " + current.format("YYYY"); // Formatted date

	const fillerBoxes = Array.from({ length: 7 - ((daysThisMonth + startDay) % 7) }); // Boxes to be empty after month ends

	// Create the event status mutation (updates event accepted/declined)
	const { mutate: updateStatus } = api.events.status.useMutation({
		onSuccess: () => {
			apiUtils.events.find.invalidate({
				groupId,
			});
		},
	});

	return (
		<div className="h-full flex flex-col w-full">
			<div className="flex justify-between flex-wrap gap-4 items-center px-4 sm:px-8">
				<div className="flex gap-2">
					{/* Button to go back a month */}
					<Button
						size={"icon"}
						variant={"outline"}
						onClick={() => setCurrent(current.subtract(1, "month"))}
					>
						<ChevronLeft size={20} />
					</Button>
					{/* Button to go forward a month */}
					<Button
						size={"icon"}
						variant={"outline"}
						onClick={() => setCurrent(current.add(1, "month"))}
					>
						<ChevronRight size={20} />
					</Button>
					{/* Button to go to today */}
					<Button variant={"outline"} onClick={() => setCurrent(dayjs())}>
						Today
					</Button>
					{/* Title with formatted date */}
					<h2>{dateFormatted}</h2>
				</div>
				{/* Create event dialog */}
				<CreateEventDialog groupId={groupId} />
			</div>
			<hr className="mt-4" />
			<div className="grid grid-cols-7">
				{/* List of days of the week for header of calendar */}
				{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
					<div key={day} className="py-2 sm:py-4 bg-white">
						<p className="text-center">{day}</p>
					</div>
				))}
			</div>
			{/* Calendar grid */}
			<div className="grid grid-cols-7 flex-1 gap-[1px] bg-[#ccc]">
				{/* Empty boxes for days before the month starts */}
				{Array.from({ length: startDay }).map((_, i) => (
					<div key={i} className="flex-1 bg-white"></div>
				))}
				{/* Calendar boxes for each day in the month */}
				{datesInMonth.map((day, i) => (
					<div key={i} className="flex-1 sm:p-1 md:p-2 bg-white flex flex-col gap-1">
						<span className="px-1 sm:px-0">{day.date()}</span>
						{/* Events for each day */}
						{events
							?.filter((event) => day.isSame(event.startsAt, "day"))
							.map((event) => (
								// Event sheet for each event
								<Sheet key={event.id}>
									<SheetTrigger asChild>
										<div
											key={event.id}
											className="bg-muted rounded p-1 pr-0 sm:p-2 cursor-pointer"
										>
											{/* Show date and name (date hidden on mobile) */}
											<p className="text-sm hidden md:block text-muted-foreground">
												{dayjs(event.startsAt).format("HH:mm")}-
												{dayjs(event.endsAt).format("HH:mm")}
											</p>
											<p className="overflow-hidden text-sm sm:text-base whitespace-nowrap sm:whitespace-normal">
												{event.name}
											</p>
										</div>
									</SheetTrigger>
									<SheetContent className="flex flex-col gap-4">
										{/* Sheet titile, description, and time */}
										<SheetHeader className="flex flex-col space-y-0 gap-4 text-left">
											<SheetTitle className="scroll-m-20 text-3xl font-semibold tracking-tight;">
												{event.name}
											</SheetTitle>
											<p className="text-sm text-muted-foreground">
												{dayjs(event.startsAt).format("h:mm A")} -{" "}
												{dayjs(event.endsAt).format("h:mm A")}
											</p>
											{event.description && (
												<SheetDescription className="text-sm text-muted-foreground">
													{event.description}
												</SheetDescription>
											)}
										</SheetHeader>
										<hr />
										{/* Accept/decline buttons */}
										<div className="flex justify-between gap-2">
											<Button
												variant={"outline"}
												className="flex-1"
												onClick={() =>
													updateStatus({
														id: event.id,
														accepted: true,
														groupId,
													})
												}
											>
												Accept
											</Button>
											<Button
												variant={"outline"}
												className="flex-1"
												onClick={() =>
													updateStatus({
														id: event.id,
														accepted: false,
														groupId,
													})
												}
											>
												Decline
											</Button>
										</div>
										{event.userToEvents.length > 0 && (
											<p className="text-muted-foreground text-sm tracking-widest">
												MEMBERS
											</p>
										)}
										{/* List of members who have accepted/declined */}
										{event.userToEvents.map(({ user, accepted }, i) => (
											<Member
												key={i}
												user={user}
												hightlight={{
													text: accepted ? "Accepted" : "Declined",
													type: accepted ? "on" : "off",
												}}
											/>
										))}
									</SheetContent>
								</Sheet>
							))}
					</div>
				))}
				{/* Empty boxes for days after the month ends */}
				{fillerBoxes.length !== 7 &&
					fillerBoxes.map((_, i) => <div key={i} className="flex-1 p-4 bg-white"></div>)}
			</div>
		</div>
	);
}
