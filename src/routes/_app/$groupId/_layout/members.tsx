import Member from "@/components/Member";
import { Button } from "@/components/ui/button";
import { api, apiUtils } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, UserMinus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/$groupId/_layout/members")({
	component: Members,
});

function Members() {
	// Get the group ID from the route
	const { groupId } = Route.useParams();

	// Query for the current user and group members
	const { data: me } = api.users.me.useQuery();
	const { data: members } = api.groups.members.useQuery({
		groupId,
	});

	// Setup the kick mutation
	const { mutate } = api.groups.kick.useMutation({
		onSuccess: () => {
			apiUtils.groups.members.invalidate({ groupId });
		},
	});

	// Check if the current user is an owner
	const isOwner = members?.some(({ role, user }) => role === "owner" && me?.id === user.id);

	// Setup the join link
	const joinLink = `${import.meta.env.VITE_SITE_URL}/${groupId}/join`;

	// Setup the copied state and copy function
	const [copied, setCopied] = useState(false);
	const copy = async (text: string) => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<div className="flex flex-col gap-6 p-4 sm:p-8 w-full">
			<h1>Members</h1>
			<hr />
			{/* If owner show the join link */}
			{isOwner && (
				<>
					<div className="flex flex-col gap-2">
						<p>Share this link with others to allow them to join this group.</p>
						<div className="flex justify-between items-center px-4 h-14 rounded bg-muted">
							<p className="font-medium text-sm text-muted-foreground">{joinLink}</p>
							<Button
								variant="outline"
								onClick={() => copy(joinLink)}
								className="gap-2"
							>
								<Copy size={16} />
								{/* Will show copied for 2 seconds after copying */}
								{copied ? "Copied!" : "Copy"}
							</Button>
						</div>
					</div>
					<hr />
				</>
			)}
			<div className="flex-1 overflow-y-auto flex-col flex gap-4 pr-4">
				{/* Loop through members and display their information */}
				{members?.map(({ user, role }, i) => (
					<div key={user.id} className="flex justify-between items-center">
						<Member user={user} />
						<span className="flex gap-3 items-center">
							<p className="text-muted-foreground text-sm">
								{role[0].toUpperCase() + role.slice(1)}
							</p>
							{isOwner && user.id !== me?.id && (
								<Button
									variant="outline"
									onClick={() => mutate({ groupId, userId: user.id })}
									className="gap-2"
								>
									<UserMinus size={16} /> Kick
								</Button>
							)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
