import { messages, users } from "@/db/schema";
import { Message } from "@/lib/types";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const messagesRouter = router({
	find: publicProcedure
		.input(
			z.object({
				groupId: z.string(),
			})
		)
		.query(async ({ ctx: { db }, input: { groupId } }) => {
			return db.query.messages.findMany({
				where: eq(messages.groupId, groupId),
				with: {
					user: true,
				},
			});
		}),
	send: protectedProcedure
		.input(
			z.object({
				content: z.string(),
				groupId: z.string(),
			})
		)
		.mutation(async ({ ctx: { db, userId, pusher }, input: { content, groupId } }) => {
			const message: Message = {
				id: generateId(15),
				content,
				groupId,
				userId,
				mediaId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const user = await db.query.users.findFirst({
				where: eq(users.id, userId),
			});
			if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
			await db.insert(messages).values(message);
			pusher.trigger(`group-${groupId}`, "message", { ...message, user });
			return { ...message, user };
		}),
});
