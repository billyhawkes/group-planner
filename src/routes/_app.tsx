import { api } from "@/trpc/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app")({
	component: App,
});

function App() {
	// Check if the user is authenticated
	const { data: isAuthed } = api.users.isAuthed.useQuery();
	const navigate = Route.useNavigate();

	// If the user is not authenticated, redirect to the home page
	useEffect(() => {
		if (isAuthed === null)
			navigate({
				to: "/",
			});
	}, [isAuthed, navigate]);

	return <Outlet />;
}
