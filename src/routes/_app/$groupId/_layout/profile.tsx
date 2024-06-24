import { Button } from "@/components/ui/button";
import { api, queryClient } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$groupId/_layout/profile")({
	component: Profile,
});

function Profile() {
	const { data: user } = api.users.me.useQuery();
	const navigate = Route.useNavigate();

	return (
		<div className="flex flex-col gap-4">
			<h1>Profile</h1>
			<p>Page to edit profile photo, birthday, and login settings</p>
			<p>{user?.email}</p>
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
