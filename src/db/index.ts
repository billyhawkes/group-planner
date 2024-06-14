import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// create the connection

export const getDB = () => {
	const client = createClient({
		url: process.env.DATABASE_URL!,
		authToken: process.env.DATABASE_TOKEN!,
	});
	return drizzle(client, { schema });
};
