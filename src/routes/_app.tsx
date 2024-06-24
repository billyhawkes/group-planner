import { api } from "@/trpc/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app")({
	component: App,
});

function App() {
	const { data: user, isSuccess } = api.users.me.useQuery();
	const navigate = Route.useNavigate();

	useEffect(() => {
		if (!user && isSuccess)
			navigate({
				to: "/login",
			});
	}, [user, navigate]);

	return <Outlet />;
}
