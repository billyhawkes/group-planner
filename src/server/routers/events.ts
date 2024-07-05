import { events, userToEvents, usersToGroups } from "@/db/schema";
import { CreateEventSchema } from "@/lib/types";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";
import { protectedGroupProcedure, router } from "../trpc";

export const eventsRouter = router({
	find: protectedGroupProcedure.query(async ({ ctx: { db }, input: { groupId } }) => {
		return db.query.events.findMany({
			where: eq(usersToGroups.groupId, groupId),
			with: {
				user: true,
				userToEvents: {
					with: {
						user: true,
					},
				},
			},
		});
	}),
	create: protectedGroupProcedure
		.input(CreateEventSchema)
		.mutation(async ({ ctx: { db, userId }, input: event }) => {
			return db.insert(events).values({ id: generateId(15), ...event, userId });
		}),
	status: protectedGroupProcedure
		.input(
			z.object({
				id: z.string(),
				accepted: z.boolean(),
			})
		)
		.mutation(async ({ ctx: { db, userId }, input: { id, accepted, groupId } }) => {
			const event = await db.query.events.findFirst({
				where: and(eq(events.id, id), eq(events.groupId, groupId)),
			});
			if (!event)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Event not found",
				});

			const isMember = await db.query.usersToGroups.findFirst({
				where: and(
					eq(usersToGroups.groupId, event.groupId),
					eq(usersToGroups.userId, userId)
				),
			});
			if (!isMember)
				throw new TRPCError({ code: "FORBIDDEN", message: "Not a member of the group" });

			// Verify that the user is a part of the event group
			return db
				.insert(userToEvents)
				.values({ userId, eventId: id, accepted })
				.onConflictDoUpdate({
					set: { accepted },
					target: [userToEvents.userId, userToEvents.eventId],
				});
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
});
