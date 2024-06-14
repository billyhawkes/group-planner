import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/chat")({
	component: Chat,
});

function Chat() {
	const [messages, setMessages] = useState<string[]>([]);
	const form = useForm({
		defaultValues: {
			content: "",
		},
		onSubmit: async ({ value }) => {
			setMessages((prev) => [...prev, value.content]);
			form.reset();
		},
	});

	return (
		<div className="flex justify-end flex-col w-full">
			<div className="flex flex-col gap-2 py-2">
				{messages.map((message, i) => (
					<div key={i} className="bg-[#f9f9f9] p-2 rounded-xl">
						{message}
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
								className="border border-[#ccc] rounded-xl h-10 w-full focus:outline-none px-4 shadow"
							/>
						);
					}}
				/>
			</form>
		</div>
	);
}
