import { buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
	component: Groups,
});

function Groups() {
	const [groups] = api.groups.find.useSuspenseQuery();

	return (
		<div className="flex flex-1 justify-center items-center flex-col gap-8 p-4">
			<h1 className="text-center">Groups</h1>
			<p className="text-center">Select one of your groups below to start</p>
			{groups?.map((group) => (
				<Link
					to="/$groupId/chat"
					params={{
						groupId: group.id,
					}}
					key={group.id}
					className={buttonVariants()}
				>
					<p>{group.name}</p>
				</Link>
			))}
		</div>
	);
}
