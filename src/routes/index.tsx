import { api } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const { data } = api.userList.useQuery();

	return (
		<div className="p-2">
			<h3 className="">Welcome Home!</h3>
			{data ? (
				<ul>
					{data.map((user) => (
						<li key={user.id}>{user.name}</li>
					))}
				</ul>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}
