import { messages, users } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const UserSchema = createSelectSchema(users);
export type User = z.infer<typeof UserSchema>;

export const EditUserSchema = UserSchema.pick({
	name: true,
	email: true,
}).extend({
	name: z.string().min(1).max(255).optional(),
	email: z.string().email().min(1).max(254),
});
export type EditUser = z.infer<typeof EditUserSchema>;

export const MessageSchema = createSelectSchema(messages);
export type Message = z.infer<typeof MessageSchema>;
