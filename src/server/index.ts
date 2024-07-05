import { eventsRouter } from "./routers/events";
import { groupRouter } from "./routers/group";
import { mediaRouter } from "./routers/media";
import { messagesRouter } from "./routers/messages";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
	media: mediaRouter,
	messages: messagesRouter,
	users: userRouter,
	groups: groupRouter,
	events: eventsRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
