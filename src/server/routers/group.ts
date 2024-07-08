import { groups, usersToGroups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";
import { protectedGroupProcedure, protectedProcedure, router } from "../trpc";

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
	members: protectedGroupProcedure.query(async ({ ctx: { db }, input: { groupId } }) => {
		const data = await db.query.usersToGroups.findMany({
			where: eq(usersToGroups.groupId, groupId),
			with: {
				user: true,
			},
		});
		return data.map(({ user }) => user);
	}),
	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
			})
		)
		.mutation(async ({ ctx: { db, userId }, input: { name } }) => {
			const groupId = generateId(15);
			await db.insert(groups).values({
				id: groupId,
				name,
			});
			await db.insert(usersToGroups).values({
				userId,
				groupId,
				role: "owner",
			});
			return null;
		}),
});
