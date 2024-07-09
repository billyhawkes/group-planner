import { buttonVariants } from "@/components/ui/button";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeft,
	Calendar,
	Image,
	Loader2,
	Menu,
	MessageCircle,
	User,
	Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { api } from "@/trpc/react";

export const Route = createFileRoute("/_app/$groupId/_layout")({
	component: Layout,
	pendingComponent: () => (
		<div className="flex justify-center items-center w-full h-full">
			<Loader2 size={48} className="animate-spin text-muted-foreground" />
		</div>
	),
});

const LinksList = ({ groupId }: { groupId: string }) => {
	return (
		<>
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
			<Link
				to="/$groupId/profile"
				params={{ groupId }}
				className={buttonVariants({
					variant: "outline",
					className: "gap-2",
				})}
			>
				<User size={18} />
				Profile
			</Link>
			<Link
				to="/$groupId/members"
				params={{ groupId }}
				className={buttonVariants({
					variant: "outline",
					className: "gap-2",
				})}
			>
				<Users size={18} />
				Members
			</Link>
		</>
	);
};

function Layout() {
	const { groupId } = Route.useParams();
	const [groups] = api.groups.find.useSuspenseQuery();

	return (
		<main className="flex flex-col flex-1">
			<div className="px-4 sm:px-8 min-h-20 h-20 items-center flex gap-2 justify-between">
				<Link
					to="/dashboard"
					className={buttonVariants({
						size: "icon",
						variant: "outline",
					})}
				>
					<ArrowLeft size={18} />
				</Link>
				<div className="gap-2 md:flex hidden justify-between">
					<LinksList groupId={groupId} />
				</div>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="md:hidden">
							<Menu size={18} />
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Menu</SheetTitle>
						</SheetHeader>
						<div className="flex flex-col pt-4 gap-2">
							<LinksList groupId={groupId} />
						</div>
					</SheetContent>
				</Sheet>
			</div>
			<div className="flex-1 flex h-[calc(100%-80px)]">
				<Outlet />
			</div>
		</main>
	);
}
