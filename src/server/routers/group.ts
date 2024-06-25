import { usersToGroups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const groupRouter = router({
	find: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
		const data = await db.query.usersToGroups.findMany({
			where: eq(usersToGroups.userId, userId),
			with: {
				group: true,
			},
		});
		return data.map(({ group }) => group);
	}),
	members: protectedProcedure
		.input(
			z.object({
				groupId: z.string(),
			})
		)
		.query(async ({ ctx: { db }, input: { groupId } }) => {
			const data = await db.query.usersToGroups.findMany({
				where: eq(usersToGroups.groupId, groupId),
				with: {
					user: true,
				},
			});
			return data.map(({ user }) => user);
		}),
});
