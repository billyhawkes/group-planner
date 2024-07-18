import { pusherClient } from "@/lib/pusher";
import { Message, User } from "@/lib/types";
import { api, apiUtils } from "@/trpc/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useEffect, useMemo } from "react";

// Extend dayjs with isToday and isYesterday
dayjs.extend(isYesterday);
dayjs.extend(isToday);

// Initialize the chat route
export const Route = createFileRoute("/_app/$groupId/_layout/chat")({
	component: Chat,
});

// This function groups messages by a user similar in time under that user
const groupMessagesByUser = (messages: (Message & { user: User })[]) => {
	// Setup an array to hold the grouped messages
	const groupedMessages: { user: User; messages: Message[] }[] = [];

	// Loop through each message
	messages.forEach((message, index) => {
		if (index === 0) {
			// First message, start the first group
			groupedMessages.push({
				user: message.user,
				messages: [message],
			});
		} else {
			// Get the last group and last message
			const lastGroup = groupedMessages[groupedMessages.length - 1];
			const lastMessage = lastGroup.messages[lastGroup.messages.length - 1];
			// Check the message is the same user and within 5 minutes
			if (
				message.user.id === lastGroup.user.id &&
				dayjs(message.createdAt).diff(dayjs(lastMessage.createdAt), "minute") < 5
			) {
				// Add to the last group
				lastGroup.messages.push(message);
			} else {
				// Create a new group
				groupedMessages.push({
					user: message.user,
					messages: [message],
				});
			}
		}
	});
	return groupedMessages;
};

function Chat() {
	// Get the group ID from the route
	const { groupId } = Route.useParams();

	// Query for all group members
	const { data: members } = api.groups.members.useQuery({
		groupId,
	});

	// Setup chat form using react-hook-form
	const form = useForm({
		defaultValues: {
			content: "",
		},
		onSubmit: async ({ value: { content } }) => {
			sendMessage({ content, groupId });
			form.reset();
		},
	});

	// Query for all group messages
	const { data: messages } = api.messages.find.useQuery({
		groupId,
	});

	// Mutation for sending a message
	const { mutate: sendMessage } = api.messages.send.useMutation();

	// Subscribe to new messages
	useEffect(() => {
		// Subscribe to the group channel
		pusherClient.subscribe(`group-${groupId}`);

		// Unbind the previous event listener (prevents duplicates)
		pusherClient.unbind("message");

		// Bind the message to update the messages list
		pusherClient.bind(
			"message",
			(
				message: Message & {
					user: User;
				}
			) => {
				apiUtils.messages.find.setData({ groupId }, (messages) => [
					...((messages as any) ?? []),
					message,
				]);
				apiUtils.messages.find.invalidate({ groupId });
			}
		);

		// On unmount, unsubscribe from the channel
		return () => {
			pusherClient.unsubscribe(`group-${groupId}`);
		};
	}, []);

	// Create and memoize the group messages
	const groupedMessages = useMemo(() => groupMessagesByUser((messages as any) ?? []), [messages]);

	return (
		<div className="flex w-full justify-between p-4 sm:p-8">
			<div className="flex justify-end flex-col flex-1">
				<div className="flex flex-col-reverse gap-2 py-2 overflow-auto shrink sm:pr-8">
					{/* Loop through the grouped messages */}
					{groupedMessages.reverse().map(({ user, messages }, i) => (
						<div key={i} className="flex gap-2">
							{/* Display the user avatar */}
							<div className="bg-muted rounded-full w-10 h-10 flex justify-center items-center">
								<p>{user.name ? user.name[0] : "A"}</p>
							</div>
							<div className="flex flex-col">
								{/* Displays the user name and date with relative dates (Today, Yesterday) */}
								<p className="font-medium flex items-center" data-cy="name-date">
									{user.name}
									<span className="text-muted-foreground text-xs ml-2">
										{dayjs(messages[0].createdAt).isToday()
											? "Today"
											: dayjs(messages[0].createdAt).isYesterday()
												? "Yesterday"
												: dayjs(messages[0].createdAt).format(
														"MMM D, YYYY"
													)}
										{", "}
										{dayjs(messages[0].createdAt).format("h:mm A")}
									</span>
								</p>
								{/* Loop through the actual messages and display */}
								{messages.map((message, y) => (
									<p key={i + y}>{message.content}</p>
								))}
							</div>
						</div>
					))}
				</div>
				{/* Form for sending a chat message */}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="sm:pr-8"
				>
					<form.Field
						name="content"
						children={(field) => {
							return (
								<input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type="text"
									autoComplete="off"
									placeholder="Type a message..."
									className="border border-[#ccc] placeholder:text-sm rounded-xl h-12 w-full focus:outline-none px-4 shadow"
								/>
							);
						}}
					/>
				</form>
			</div>
			{/* Show messages if the screen is large enough */}
			<aside className="w-48 border-l p-8 hidden sm:flex">
				<div className="flex flex-col gap-2">
					<p className="text-muted-foreground text-sm tracking-widest">MEMBERS</p>
					{/* Loop through the members and display their avatar and name */}
					{members?.map(({ user }, i) => (
						<div key={i} className="flex gap-2 items-center">
							<div className="bg-muted rounded-full w-8 h-8 flex justify-center items-center">
								<p>{user.name ? user.name[0] : "A"}</p>
							</div>
							<div className="flex flex-col gap-0">
								<p className="font-medium">{user.name}</p>
								{/* <p
									className={cn(
										"text-xs",
										user.status === "online"
											? "text-green-600"
											: "text-muted-foreground"
									)}
								>
									{user.status}
								</p> */}
							</div>
						</div>
					))}
				</div>
			</aside>
		</div>
	);
}
