import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// create the connection

export const getDB = () => {
	const client = createClient({
		url: process.env.DATABASE_URL!,
		authToken: process.env.DATABASE_TOKEN!,
	});
	return drizzle(client);
};
