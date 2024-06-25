import { messages } from "@/db/schema";
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
		.mutation(async ({ ctx: { db, userId }, input: { content, groupId } }) => {
			return db.insert(messages).values({
				id: generateId(15),
				content,
				groupId,
				userId,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}),
});
