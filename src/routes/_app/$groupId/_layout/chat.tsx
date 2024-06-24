import { testUsers } from "@/lib/data";
import { cn } from "@/lib/utils";
import { api, apiUtils } from "@/trpc/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";

export const Route = createFileRoute("/_app/$groupId/_layout/chat")({
	component: Chat,
});

function Chat() {
	const { groupId } = Route.useParams();
	const { data: messages } = api.messages.find.useQuery({
		groupId,
	});
	const { mutate: sendMessage } = api.messages.send.useMutation();
	const form = useForm({
		defaultValues: {
			content: "",
		},
		onSubmit: async ({ value: { content } }) => {
			sendMessage({ content, groupId });
			form.reset();
			apiUtils.messages.find.invalidate();
		},
	});

	return (
		<div className="flex w-full justify-between">
			<div className="flex justify-end flex-col flex-1 pr-8">
				<div className="flex flex-col gap-2 py-2">
					{messages?.map((message, i) => (
						<div
							key={i}
							className="bg-[#f9f9f9] px-4 h-10 flex items-center rounded-xl self-end"
						>
							{message.content}
						</div>
					))}
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
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
			<aside className="w-48 border-l p-8">
				<div className="flex flex-col gap-2">
					<p className="text-muted-foreground text-sm tracking-widest">MEMBERS</p>
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
									{user.status}
								</p>
							</div>
						</div>
					))}
				</div>
			</aside>
		</div>
	);
}
