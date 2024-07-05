import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$groupId/_layout/")({
	component: Index,
});

function Index() {
	return <div className="p-8"></div>;
}
