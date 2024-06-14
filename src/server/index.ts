import { mediaRouter } from "./routers/media";
import { messagesRouter } from "./routers/messages";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
	userList: publicProcedure.query(async () => {
		// Retrieve users from a datasource, this is an imaginary database
		return [{ id: 1, name: "John Doe" }];
	}),
	media: mediaRouter,
	messages: messagesRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
