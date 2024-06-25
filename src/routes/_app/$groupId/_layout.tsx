import { buttonVariants } from "@/components/ui/button";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Calendar, Check, ChevronsUpDown, Image, Loader2, MessageCircle, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useState } from "react";

export const Route = createFileRoute("/_app/$groupId/_layout")({
	component: Layout,
	pendingComponent: () => (
		<div className="flex justify-center items-center w-screen h-screen">
			<Loader2 size={48} className="animate-spin text-muted-foreground" />
		</div>
	),
});

export function GroupPicker({ groups }: { groups: { id: string; name: string }[] }) {
	const { groupId } = Route.useParams();
	const [open, setOpen] = useState(false);
	const navigate = Route.useNavigate();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{groupId
						? groups.find((group) => group.id === groupId)?.name
						: "Select group..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandInput placeholder="Search groups..." />
						<CommandEmpty>No group found.</CommandEmpty>
						<CommandGroup>
							{(groups ?? []).map((group) => (
								<CommandItem
									key={group.id}
									value={group.id}
									onSelect={(currentValue) => {
										navigate({
											to: "/$groupId/chat",
											params: {
												groupId: currentValue,
											},
										});
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											group.id === groupId ? "opacity-100" : "opacity-0"
										)}
									/>
									{group.name}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function Layout() {
	const { groupId } = Route.useParams();
	const [groups] = api.groups.find.useSuspenseQuery();

	return (
		<div>
			<main className="flex flex-col h-screen">
				<div className="p-8 flex gap-2 justify-between">
					<div className="flex gap-2">
						<GroupPicker groups={groups} />
						<Link
							to="/$groupId/chat"
							params={{ groupId }}
							className={buttonVariants({
								variant: "outline",
								className: "gap-2",
							})}
						>
							<MessageCircle size={18} />
							Chat
						</Link>
						<Link
							to="/$groupId/media"
							params={{ groupId }}
							className={buttonVariants({
								variant: "outline",
								className: "gap-2",
							})}
						>
							<Image size={18} />
							Media
						</Link>
						<Link
							to="/$groupId/events"
							params={{ groupId }}
							className={buttonVariants({
								variant: "outline",
								className: "gap-2",
							})}
						>
							<Calendar size={18} />
							Events
						</Link>
					</div>
					<Link
						to="/$groupId/profile"
						params={{ groupId }}
						className={buttonVariants({ variant: "outline", className: "gap-2" })}
					>
						<User size={18} />
					</Link>
				</div>
				<div className="flex-1 p-8 flex">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
