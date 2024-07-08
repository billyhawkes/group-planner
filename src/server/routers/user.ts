import { users } from "@/db/schema";
import { EditUserSchema } from "@/lib/types";
import { eq } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
	isAuthed: publicProcedure.query(async ({ ctx: { userId } }) => {
		return userId ? true : null;
	}),
	me: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
		console.log(userId);
		return db.query.users.findFirst({
			where: eq(users.id, userId),
		});
	}),
	update: protectedProcedure
		.input(EditUserSchema)
		.mutation(async ({ ctx: { db, userId }, input }) => {
			return db.update(users).set(input).where(eq(users.id, userId));
		}),
});
