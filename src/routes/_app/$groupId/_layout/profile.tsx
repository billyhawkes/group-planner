import { Button } from "@/components/ui/button";
import { api, queryClient } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditUser, EditUserSchema } from "@/lib/types";

export const Route = createFileRoute("/_app/$groupId/_layout/profile")({
	component: Profile,
});

function Profile() {
	const [user] = api.users.me.useSuspenseQuery();
	const navigate = Route.useNavigate();

	const { mutate: editUser } = api.users.update.useMutation();

	// 1. Define your form.
	const form = useForm<EditUser>({
		resolver: zodResolver(EditUserSchema),
		defaultValues: {
			email: user?.email ?? "",
			name: user?.name ?? "",
		},
	});

	function onSubmit(values: EditUser) {
		editUser(values);
	}

	return (
		<div className="flex flex-col gap-4 p-4 sm:p-8">
			<h1>Profile</h1>
			<p>Page to edit profile photo, email, name and login settings</p>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			<hr />
			<Button
				variant="outline"
				onClick={() => {
					fetch("/auth/signout").then(() => {
						navigate({
							to: "/",
						});
						queryClient.clear();
					});
				}}
			>
				Sign out
			</Button>
		</div>
	);
}
