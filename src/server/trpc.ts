import { getLucia } from "@/auth";
import { getDB } from "@/db";
import { initTRPC } from "@trpc/server";
import { AwsClient } from "aws4fetch";
import { EventHandlerRequest, H3Event, getCookie } from "vinxi/http";

export const createTRPCContext = async ({ event }: { event: H3Event<EventHandlerRequest> }) => {
	const sessionId = getCookie(event, "auth_session");
	const r2 = new AwsClient({
		accessKeyId: process.env.R2_KEY_ID!,
		secretAccessKey: process.env.R2_ACCESS_KEY!,
		region: "auto",
	});
	const db = getDB();
	const lucia = getLucia();

	if (!sessionId) {
		return {
			db,
			r2,
			userId: null,
		};
	}

	const { session } = await lucia.validateSession(sessionId);

	if (!session) {
		return {
			db,
			r2,
			userId: null,
		};
	}

	return {
		db,
		r2,
		userId: session.userId,
	};
};

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
