import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Initialize the database client
export const getDB = (options?: { url: string; token: string }) => {
	const client = createClient({
		url: options?.url ? options.url : process.env.DATABASE_URL!,
		authToken: options?.token ? options.token : process.env.DATABASE_TOKEN!,
	});
	return drizzle(client, { schema });
};
