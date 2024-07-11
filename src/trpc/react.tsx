import { AppRouter } from "@/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

// Export the TRPC React client
export const api = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

// Trpc client
const client = api.createClient({
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === "development" ||
				(op.direction === "down" && op.result instanceof Error),
		}),
		httpBatchLink({
			url: "/trpc",
			transformer: superjson,
		}),
	],
});

// Export the TRPC query utils
export const apiUtils = createTRPCQueryUtils({ queryClient, client });

export function TRPCReactProvider(props: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={client} queryClient={queryClient}>
				{props.children}
			</api.Provider>
		</QueryClientProvider>
	);
}
