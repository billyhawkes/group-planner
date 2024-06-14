import { messages } from "@/db/schema";
import { generateId } from "lucia";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const messagesRouter = router({
	find: publicProcedure.query(async ({ ctx: { db } }) => {
		return db.query.messages.findMany();
	}),
	send: publicProcedure
		.input(
			z.object({
				content: z.string(),
			})
		)
		.mutation(async ({ ctx: { db }, input: { content } }) => {
			return db.insert(messages).values({
				id: generateId(15),
				content,
				groupId: "1",
				userId: "1",
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}),
});
