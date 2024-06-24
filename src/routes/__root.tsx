import { TRPCReactProvider } from "@/trpc/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<TRPCReactProvider>
			<Outlet />
		</TRPCReactProvider>
	),
});
