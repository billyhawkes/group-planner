import CreateGroupDialog from "@/components/CreateGroupDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
	component: Groups,
});

function Groups() {
	// Get the list of groups
	const [groups] = api.groups.find.useSuspenseQuery();

	return (
		<div className="flex flex-1 justify-center items-center flex-col gap-8 p-4">
			<h1 className="text-center">Groups</h1>
			<p className="text-center">Select one of your groups below or create a new one</p>
			<div className="flex gap-2 flex-wrap">
				{/* Loop through the groups and show a button for each */}
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
				{/* Open the CreateGroupDialog when the button is clicked */}
				<CreateGroupDialog>
					<DialogTrigger asChild>
						<Button variant={"outline"} className="gap-2">
							<Plus size={18} />
							Create Group
						</Button>
					</DialogTrigger>
				</CreateGroupDialog>
			</div>
		</div>
	);
}
