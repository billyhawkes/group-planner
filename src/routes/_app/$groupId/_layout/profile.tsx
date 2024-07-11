import { Button } from "@/components/ui/button";
import { api, apiUtils } from "@/trpc/react";
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
	// Get the current user
	const [user] = api.users.me.useSuspenseQuery();
	const navigate = Route.useNavigate();

	// Setup the edit user mutation
	const { mutate: editUser } = api.users.update.useMutation();

	// Setup the form with the user data as default if it exists
	const form = useForm<EditUser>({
		resolver: zodResolver(EditUserSchema),
		defaultValues: {
			email: user?.email ?? "",
			name: user?.name ?? "",
		},
	});

	// Handle form submission
	function onSubmit(values: EditUser) {
		editUser(values);
	}

	return (
		<div className="flex flex-col gap-4 p-4 sm:p-8">
			<h1>Profile</h1>
			<p>Page to edit profile photo, email, name and login settings</p>
			{/* Edit user profile form */}
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
			{/* Sign out button that navigates home and clears the cache */}
			<Button
				variant="outline"
				onClick={() => {
					fetch("/auth/signout").then(() => {
						navigate({
							to: "/",
						});
						apiUtils.invalidate();
					});
				}}
			>
				Sign out
			</Button>
		</div>
	);
}
