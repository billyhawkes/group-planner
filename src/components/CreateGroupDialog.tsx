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
	const { mutate } = api.groups.create.useMutation({
		onSuccess: ({ groupId }) => {
			apiUtils.groups.find.invalidate();
			navigate({
				to: "/$groupId/chat",
				params: {
					groupId,
				},
			});
		},
	});
	const form = useForm<CreateGroup>({
		resolver: zodResolver(CreateGroupSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = (values: CreateGroup) => {
		mutate(values);
	};
	return (
		<Dialog>
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
