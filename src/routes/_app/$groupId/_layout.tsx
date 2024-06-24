import { buttonVariants } from "@/components/ui/button";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Calendar, Image, MessageCircle, User } from "lucide-react";

export const Route = createFileRoute("/_app/$groupId/_layout")({
	component: Layout,
});

function Layout() {
	const { groupId } = Route.useParams();

	return (
		<div>
			<main className="flex flex-col h-screen">
				<div className="p-8 flex gap-2 justify-between">
					<div className="flex gap-2">
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
