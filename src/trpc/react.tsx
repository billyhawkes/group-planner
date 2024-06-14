import { AppRouter } from "@/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";

export const api = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();
const client = api.createClient({
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === "development" ||
				(op.direction === "down" && op.result instanceof Error),
		}),
		httpBatchLink({
			url: "/trpc",
		}),
	],
});
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