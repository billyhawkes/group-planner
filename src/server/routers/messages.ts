import { messages, users } from "@/db/schema";
import { Message } from "@/lib/types";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";
import { protectedGroupProcedure, router } from "../trpc";

export const messagesRouter = router({
	// Find all messages for a group
	find: protectedGroupProcedure.query(async ({ ctx: { db }, input: { groupId } }) => {
		return db.query.messages.findMany({
			where: eq(messages.groupId, groupId),
			with: {
				user: true,
			},
		});
	}),
	// Send a message to a group
	send: protectedGroupProcedure
		.input(
			z.object({
				content: z.string(),
			})
		)
		.mutation(async ({ ctx: { db, userId, pusher }, input: { content, groupId } }) => {
			const message: Message = {
				id: generateId(15),
				content,
				groupId,
				userId,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			// Verify that the user exists
			const user = await db.query.users.findFirst({
				where: eq(users.id, userId),
			});
			if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
			await db.insert(messages).values(message);
			// Push the message to the group channel
			await pusher.trigger(`group-${groupId}`, "message", { ...message, user });
			return { ...message, user };
		}),
});
