import { api } from "@/trpc/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app")({
	component: App,
});

function App() {
	const { data: isAuthed } = api.users.isAuthed.useQuery();
	const navigate = Route.useNavigate();

	useEffect(() => {
		if (isAuthed === null)
			navigate({
				to: "/",
			});
	}, [isAuthed, navigate]);

	return <Outlet />;
}
