import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

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
			});
		}),
	getPresignedUrl: publicProcedure
		.input(
			z.object({
				type: z.string(),
				size: z.number(),
			})
		)
		.mutation(async ({ ctx: { r2 }, input: { type, size } }) => {
			const id = generateId(15);
			console.log(`${process.env.R2_ENDPOINT}/test-images/${id}`);
			const res = await r2.sign(`${process.env.R2_ENDPOINT}/test-images/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": type,
					"Content-Length": `${size}`,
				},
				aws: {
					signQuery: true,
				},
			});
			console.log(res.url, id);

			return {
				url: res.url,
				id,
			};
		}),
	create: publicProcedure
		.input(
			z.object({
				id: z.string(),
				groupId: z.string(),
			})
		)
		.mutation(async ({ ctx: { db }, input: { id, groupId } }) => {
			return db.insert(media).values({
				id,
				userId: "1",
				groupId,
				type: "image",
				createdAt: new Date(),
			});
		}),
});
