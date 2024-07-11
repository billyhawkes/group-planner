import { users } from "@/db/schema";
import { EditUserSchema } from "@/lib/types";
import { eq } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
	// Check if the user is authenticated
	isAuthed: publicProcedure.query(async ({ ctx: { userId } }) => {
		return userId ? true : null;
	}),
	// Find the user's information
	me: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
		console.log(userId);
		return db.query.users.findFirst({
			where: eq(users.id, userId),
		});
	}),
	// Update the user's information
	update: protectedProcedure
		.input(EditUserSchema)
		.mutation(async ({ ctx: { db, userId }, input }) => {
			return db.update(users).set(input).where(eq(users.id, userId));
		}),
});
