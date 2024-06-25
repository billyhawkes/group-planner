import { buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

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

export const Route = createFileRoute("/_app/dashboard")({
	component: Groups,
});

function Groups() {
	const [groups] = api.groups.find.useSuspenseQuery();
	const [user] = api.users.me.useSuspenseQuery();

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
		<div className="w-screen h-screen flex flex-col items-center justify-center gap-6">
			<h1>Dashboard</h1>
			<h1>Account</h1>
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
			<h1>Groups</h1>
			{groups?.map((group) => (
				<Link
					to="/$groupId/chat"
					params={{
						groupId: group.id,
					}}
					key={group.id}
					className={buttonVariants({
						variant: "outline",
					})}
				>
					<p>{group.name}</p>
				</Link>
			))}
		</div>
	);
}
