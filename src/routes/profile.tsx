import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
	component: Profile,
});

function Profile() {
	return (
		<div>
			<h1>Profile</h1>
			<p>Page to edit profile photo, birthday, and login settings</p>
		</div>
	);
}
