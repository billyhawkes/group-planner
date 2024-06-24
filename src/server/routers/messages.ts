import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

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
			});
		}),
	send: publicProcedure
		.input(
			z.object({
				content: z.string(),
				groupId: z.string(),
			})
		)
		.mutation(async ({ ctx: { db }, input: { content, groupId } }) => {
			return db.insert(messages).values({
				id: generateId(15),
				content,
				groupId,
				userId: "1",
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}),
});
