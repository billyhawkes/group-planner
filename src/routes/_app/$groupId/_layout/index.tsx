import { api } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$groupId/_layout/")({
	component: Index,
});

function Index() {
	const { data } = api.userList.useQuery();

	return <div className="p-8"></div>;
}
