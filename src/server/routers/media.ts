import { media } from "@/db/schema";
import { generateId } from "lucia";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const mediaRouter = router({
	find: publicProcedure.query(async ({ ctx: { db } }) => {
		return db.query.media.findMany();
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
			})
		)
		.mutation(async ({ ctx: { db }, input: { id } }) => {
			return db.insert(media).values({
				id,
				userId: "1",
				groupId: "1",
				type: "image",
				createdAt: new Date(),
			});
		}),
});
