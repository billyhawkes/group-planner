import { buttonVariants } from "@/components/ui/button";
import { TRPCReactProvider } from "@/trpc/react";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Calendar, Image, MessageCircle, User } from "lucide-react";

export const Route = createRootRoute({
	component: () => (
		<TRPCReactProvider>
			<main className="flex flex-col h-screen">
				<div className="p-8 flex gap-2 justify-between">
					<div className="flex gap-2">
						<Link
							to="/chat"
							className={buttonVariants({ variant: "outline", className: "gap-2" })}
						>
							<MessageCircle size={18} />
							Chat
						</Link>
						<Link
							to="/media"
							className={buttonVariants({ variant: "outline", className: "gap-2" })}
						>
							<Image size={18} />
							Media
						</Link>
						<Link
							to="/events"
							className={buttonVariants({ variant: "outline", className: "gap-2" })}
						>
							<Calendar size={18} />
							Events
						</Link>
					</div>
					<Link
						to="/profile"
						className={buttonVariants({ variant: "outline", className: "gap-2" })}
					>
						<User size={18} />
					</Link>
				</div>
				<div className="flex-1 p-8 flex">
					<Outlet />
				</div>
			</main>
		</TRPCReactProvider>
	),
});
