import { api } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const { data } = api.userList.useQuery();

	return <div className="p-8"></div>;
}
