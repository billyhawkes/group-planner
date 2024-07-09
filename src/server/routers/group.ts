import { groups, usersToGroups } from "@/db/schema";
import { CreateGroupSchema } from "@/lib/types";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";
import {
	protectedGroupOwnerProcedure,
	protectedGroupProcedure,
	protectedProcedure,
	router,
} from "../trpc";

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
		return db.query.usersToGroups.findMany({
			where: eq(usersToGroups.groupId, groupId),
			with: {
				user: true,
			},
		});
	}),
	create: protectedProcedure
		.input(CreateGroupSchema)
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
			return { groupId };
		}),
	join: protectedProcedure
		.input(
			z.object({
				groupId: z.string(),
			})
		)
		.mutation(async ({ ctx: { db, userId }, input: { groupId } }) => {
			const group = await db.query.groups.findFirst({
				where: eq(groups.id, groupId),
			});
			if (!group)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Group not found",
				});

			await db
				.insert(usersToGroups)
				.values({
					userId,
					groupId,
					role: "member",
				})
				.onConflictDoNothing();

			return { groupId };
		}),
	kick: protectedGroupOwnerProcedure
		.input(
			z.object({
				userId: z.string(),
			})
		)
		.mutation(async ({ ctx: { db }, input: { groupId, userId } }) => {
			await db
				.delete(usersToGroups)
				.where(and(eq(usersToGroups.groupId, groupId), eq(usersToGroups.userId, userId)));
			return null;
		}),
});
