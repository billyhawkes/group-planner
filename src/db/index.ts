import { drizzle } from "drizzle-orm/d1";

// create the connection

export const getDB = () => {
	return drizzle("");
};
