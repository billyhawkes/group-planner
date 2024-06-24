import { getDB } from "@/db";
import { sessions, users } from "@/db/schema";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

export const getLucia = () => {
	const db = getDB();
	const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

	return new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				secure: process.env.NODE_ENV === "production",
			},
		},
	});
};
