import { usersToGroups } from "@/db/schema";
import { eq } from "drizzle-orm";
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
});
