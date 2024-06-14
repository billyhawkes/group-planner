import { buttonVariants } from "@/components/ui/button";
import { TRPCReactProvider } from "@/trpc/react";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Image, MessageCircle } from "lucide-react";

export const Route = createRootRoute({
	component: () => (
		<TRPCReactProvider>
			<main className="flex flex-col h-screen">
				<div className="p-8 flex gap-2">
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
				</div>
				<div className="flex-1 p-8 flex">
					<Outlet />
				</div>
			</main>
			<TanStackRouterDevtools />
		</TRPCReactProvider>
	),
});
