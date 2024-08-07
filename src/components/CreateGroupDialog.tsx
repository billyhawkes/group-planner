import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateGroup, CreateGroupSchema } from "@/lib/types";
import { api, apiUtils } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

const CreateGroupDialog = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();

	// Create a new group mutation
	const { mutate } = api.groups.create.useMutation({
		onSuccess: ({ groupId }) => {
			// Invalidate the groups query and navigate to the chat page of the new group
			apiUtils.groups.find.invalidate();
			navigate({
				to: "/$groupId/chat",
				params: {
					groupId,
				},
			});
		},
	});

	// Setup the form
	const form = useForm<CreateGroup>({
		resolver: zodResolver(CreateGroupSchema),
		defaultValues: {
			name: "",
		},
	});

	// Handle form submission
	const onSubmit = (values: CreateGroup) => {
		mutate(values);
	};

	return (
		// Dialog component
		<Dialog>
			{/* Allow the component to render trigger */}
			{children}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Group</DialogTitle>
					<DialogDescription>
						Fill out the form below to create a group.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{/* Name field */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Group Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>Select a name for your group.</FormDescription>
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

export default CreateGroupDialog;
