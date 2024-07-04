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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/_app/$groupId/_layout/events")({
	component: Events,
});

const CreateEventFormSchema = CreateEventSchema.extend({
	startsAt: z.string().min(1, {
		message: "Start date is required",
	}),
	endsAt: z.string().min(1, {
		message: "End date is required",
	}),
});
type CreateEventForm = z.infer<typeof CreateEventFormSchema>;

const CreateEventDialog = ({ groupId }: { groupId: string }) => {
	const [open, setOpen] = useState(false);
	const { mutate } = api.events.create.useMutation({
		onSuccess: () => {
			apiUtils.events.find.invalidate({
				groupId,
			});
			setOpen(false);
		},
	});
	const form = useForm<CreateEventForm>({
		resolver: zodResolver(CreateEventFormSchema),
		defaultValues: {
			groupId,
			name: "",
			description: undefined,
			startsAt: "",
			endsAt: "",
		},
	});

	// 2. Define a submit handler.
	const onSubmit = (values: CreateEventForm) => {
		mutate({ ...values, startsAt: new Date(values.startsAt), endsAt: new Date(values.endsAt) });
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Create Event</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Event</DialogTitle>
					<DialogDescription>
						Fill out the form below to create an event.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
						<FormField
							control={form.control}
							name="startsAt"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Start</FormLabel>
									<FormControl>
										<input
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
						<FormField
							control={form.control}
							name="endsAt"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>End</FormLabel>
									<FormControl>
										<input
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
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

function Events() {
	const { groupId } = Route.useParams();
	const { data: events } = api.events.find.useQuery({
		groupId,
	});
	const [current, setCurrent] = useState(dayjs());
	const daysThisMonth = current.daysInMonth();
	const datesInMonth = Array.from({ length: daysThisMonth }).map((_, i) => {
		return current.date(i + 1);
	});
	const startDay = current.startOf("month").day();
	const dateFormatted = current.format("MMMM") + " " + current.format("YYYY");

	const fillerBoxes = Array.from({ length: 7 - ((daysThisMonth + startDay) % 7) });

	const { mutate: updateStatus } = api.events.status.useMutation({
		onSuccess: () => {
			apiUtils.events.find.invalidate({
				groupId,
			});
		},
	});

	return (
		<div className="h-full flex flex-col w-full">
			<div className="flex justify-between items-center px-4 sm:px-8">
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
				<CreateEventDialog groupId={groupId} />
			</div>
			<hr className="mt-4" />
			<div className="grid grid-cols-7">
				{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
					<div key={day} className="py-2 sm:py-4 bg-white">
						<p className="text-center">{day}</p>
					</div>
				))}
			</div>
			<div className="grid grid-cols-7 flex-1 gap-[1px] bg-[#ccc]">
				{Array.from({ length: startDay }).map((_, i) => (
					<div key={i} className="flex-1 bg-white"></div>
				))}
				{datesInMonth.map((day, i) => (
					<div key={i} className="flex-1 sm:p-1 md:p-2 bg-white flex flex-col gap-1">
						<span className="px-1 sm:px-0">{day.date()}</span>
						{events
							?.filter((event) => day.isSame(event.startsAt, "day"))
							.map((event) => (
								<Sheet key={event.id}>
									<SheetTrigger asChild>
										<div
											key={event.id}
											className="bg-muted rounded p-1 pr-0 sm:p-2 cursor-pointer"
										>
											<p className="text-sm hidden md:block text-muted-foreground">
												{dayjs(event.startsAt).format("HH:mm")}-
												{dayjs(event.endsAt).format("HH:mm")}
											</p>
											<p className="overflow-hidden text-sm sm:text-base whitespace-nowrap sm:whitespace-normal">
												{event.name}
											</p>
										</div>
									</SheetTrigger>
									<SheetContent>
										<SheetHeader className="flex flex-col space-y-0 gap-4">
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
											<hr />
											<div className="flex justify-between gap-2">
												<Button
													variant={"outline"}
													className="flex-1"
													onClick={() =>
														updateStatus({
															id: event.id,
															accepted: true,
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
