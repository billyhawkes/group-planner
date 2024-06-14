import { TRPCReactProvider } from "@/trpc/react";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { MessageCircle } from "lucide-react";

export const Route = createRootRoute({
	component: () => (
		<TRPCReactProvider>
			<main className="flex flex-col h-screen">
				<div className="p-2 flex gap-2">
					<Link
						to="/chat"
						className="px-4 h-10 gap-2 rounded-xl border border-[#ccc] flex items-center justify-center shadow"
					>
						<MessageCircle size={18} />
						Chat
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
