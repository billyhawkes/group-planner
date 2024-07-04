import Member from "@/components/Member";
import { api } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$groupId/_layout/members")({
	component: Members,
});

function Members() {
	const { groupId } = Route.useParams();
	const { data: members } = api.groups.members.useQuery({
		groupId,
	});

	return (
		<div className="flex flex-col gap-4 p-4 sm:p-8">
			<h1>Members</h1>
			{members?.map((user, i) => <Member key={i} user={user} />)}
		</div>
	);
}
