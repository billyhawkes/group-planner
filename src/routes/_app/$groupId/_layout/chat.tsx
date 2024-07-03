import { pusherClient } from "@/lib/pusher";
import { Message, User } from "@/lib/types";
import { api, apiUtils } from "@/trpc/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useEffect, useMemo } from "react";

dayjs.extend(isYesterday);
dayjs.extend(isToday);

export const Route = createFileRoute("/_app/$groupId/_layout/chat")({
	component: Chat,
});

const groupMessagesByUser = (messages: (Message & { user: User })[]) => {
	const groupedMessages: { user: User; messages: Message[] }[] = [];
	messages.forEach((message, index) => {
		if (index === 0) {
			// First message, start the first group
			groupedMessages.push({
				user: message.user,
				messages: [message],
			});
		} else {
			const lastGroup = groupedMessages[groupedMessages.length - 1];
			const lastMessage = lastGroup.messages[lastGroup.messages.length - 1];
			// Check if the current message is by the same user as the last message in the last group and if the last message was sent within 5 minutes
			if (
				message.user.id === lastGroup.user.id &&
				dayjs(message.createdAt).diff(dayjs(lastMessage.createdAt), "minute") < 5
			) {
				// Add to the last group
				lastGroup.messages.push(message);
			} else {
				// Start a new group
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
	const { groupId } = Route.useParams();
	const { data: members } = api.groups.members.useQuery({
		groupId,
	});

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

	// Usage
	const groupedMessages = useMemo(() => groupMessagesByUser((messages as any) ?? []), [messages]);

	return (
		<div className="flex w-full justify-between">
			<div className="flex justify-end flex-col flex-1">
				<div className="flex flex-col gap-2 py-2 overflow-auto shrink sm:pr-8">
					{groupedMessages.map(({ user, messages }, i) => (
						<div key={i} className="flex gap-2">
							<div className="bg-muted rounded-full w-10 h-10 flex justify-center items-center">
								<p>{user.name ? user.name[0] : "A"}</p>
							</div>
							<div className="flex flex-col">
								<p className="font-medium flex items-center">
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
								{messages.map((message, y) => (
									<p key={i + y}>{message.content}</p>
								))}
							</div>
						</div>
					))}
				</div>
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
									className="border border-[#ccc] rounded-xl h-12 w-full focus:outline-none px-4 shadow"
								/>
							);
						}}
					/>
				</form>
			</div>
			<aside className="w-48 border-l p-8 hidden sm:flex">
				<div className="flex flex-col gap-2">
					<p className="text-muted-foreground text-sm tracking-widest">MEMBERS</p>
					{members?.map((user, i) => (
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
