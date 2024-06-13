import { TRPCReactProvider } from "@/trpc/react";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: () => (
		<TRPCReactProvider>
			<div className="p-2 flex gap-2">
				<Link to="/" className="[&.active]:font-bold">
					Home
				</Link>
			</div>
			<hr />
			<Outlet />
			<TanStackRouterDevtools />
		</TRPCReactProvider>
	),
});
