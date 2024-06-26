import { buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
	component: Groups,
});

function Groups() {
	const [groups] = api.groups.find.useSuspenseQuery();

	return (
		<div className="w-screen h-screen flex flex-col items-center justify-center gap-6">
			<h1>Groups</h1>
			{groups?.map((group) => (
				<Link
					to="/$groupId/chat"
					params={{
						groupId: group.id,
					}}
					key={group.id}
					className={buttonVariants({
						variant: "outline",
					})}
				>
					<p>{group.name}</p>
				</Link>
			))}
		</div>
	);
}
