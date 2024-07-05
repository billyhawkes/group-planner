import { getDB } from "@/db";
import { usersToGroups } from "@/db/schema";
import { getLucia } from "@/lib/lucia";
import { TRPCError, initTRPC } from "@trpc/server";
import { AwsClient } from "aws4fetch";
import { and, eq } from "drizzle-orm";
import Pusher from "pusher";
import superjson from "superjson";
import { EventHandlerRequest, H3Event, getCookie } from "vinxi/http";
import { z } from "zod";

export const createTRPCContext = async ({ event }: { event: H3Event<EventHandlerRequest> }) => {
	const sessionId = getCookie(event, "auth_session");
	const lucia = getLucia();

	const utils = {
		db: getDB(),
		r2: new AwsClient({
			accessKeyId: process.env.R2_KEY_ID!,
			secretAccessKey: process.env.R2_ACCESS_KEY!,
			region: "auto",
		}),
		pusher: new Pusher({
			appId: "1828662",
			key: process.env.VITE_PUSHER_KEY!,
			secret: process.env.PUSHER_SECRET!,
			cluster: "us2",
			useTLS: true,
		}),
	};

	if (!sessionId) {
		return {
			...utils,
			userId: null,
		};
	}

	const { session } = await lucia.validateSession(sessionId);

	if (!session) {
		return {
			...utils,
			userId: null,
		};
	} else {
		return {
			...utils,
			userId: session.userId,
		};
	}
};

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.userId) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource.",
		});
	}

	return next({
		ctx: {
			...ctx,
			userId: ctx.userId,
		},
	});
});

export const protectedGroupProcedure = protectedProcedure
	.input(
		z.object({
			groupId: z.string(),
		})
	)
	.use(async ({ ctx, input, next }) => {
		const group = await ctx.db.query.usersToGroups.findFirst({
			where: and(
				eq(usersToGroups.groupId, input.groupId),
				eq(usersToGroups.userId, ctx.userId)
			),
		});

		if (!group) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You are not a part of this group.",
			});
		}

		return next({
			ctx: {
				...ctx,
				role: group.role,
			},
		});
	});
