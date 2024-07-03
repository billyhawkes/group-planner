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
		<div className="flex flex-col gap-4">
			<h1>Members</h1>
			{members?.map((user, i) => (
				<div key={i} className="flex gap-2 items-center">
					<div className="bg-muted rounded-full w-10 h-10 flex justify-center items-center">
						<p>{user.name ? user.name[0] : "A"}</p>
					</div>
					<div className="flex flex-col gap-0">
						<p className="font-medium">{user.name}</p>
						{/* <p
						className={cn(
							"text-xs",
							user.status === "online"
								? "text-green-600"
								: "text-muted-foreground"
						)}
					>
						{user.status}
					</p> */}
					</div>
				</div>
			))}
		</div>
	);
}
