import { media } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const mediaRouter = router({
	find: publicProcedure
		.input(
			z.object({
				groupId: z.string(),
			})
		)
		.query(async ({ ctx: { db }, input: { groupId } }) => {
			return db.query.media.findMany({
				where: eq(media.groupId, groupId),
				with: {
					user: true,
				},
			});
		}),
	getPresignedUrl: publicProcedure
		.input(
			z.object({
				type: z.string(),
				size: z.number(),
				groupId: z.string(),
			})
		)
		.mutation(async ({ ctx: { r2 }, input: { type, size, groupId } }) => {
			const id = generateId(15);
			const res = await r2.sign(`${process.env.R2_ENDPOINT}/${groupId}/media/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": type,
					"Content-Length": `${size}`,
				},
				aws: {
					signQuery: true,
				},
			});

			return {
				url: res.url,
				id,
			};
		}),
	create: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				groupId: z.string(),
			})
		)
		.mutation(async ({ ctx: { db, userId }, input: { id, groupId } }) => {
			return db.insert(media).values({
				id,
				userId,
				groupId,
				type: "image",
				createdAt: new Date(),
			});
		}),
	delete: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				groupId: z.string(),
			})
		)
		.mutation(async ({ ctx: { db, r2, userId }, input: { groupId, id } }) => {
			await db.delete(media).where(and(eq(media.id, id), eq(media.userId, userId)));
			r2.fetch(`${process.env.R2_ENDPOINT}/${groupId}/media/${id}`, {
				method: "DELETE",
			});
		}),
});
