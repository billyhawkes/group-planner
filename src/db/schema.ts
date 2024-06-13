import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: text("id").notNull().primaryKey(),
});

export const sessions = sqliteTable("sessions", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: integer("expires_at").notNull(),
});

export const usersToGroups = sqliteTable("users_to_groups", {
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	groupId: text("group_id")
		.notNull()
		.references(() => groups.id),
});

export const groups = sqliteTable("groups", {
	id: text("id").notNull().primaryKey(),
	name: text("name").notNull(),
});

export const messages = sqliteTable("messages", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	groupId: text("group_id")
		.notNull()
		.references(() => groups.id),
	content: text("content").notNull(),
	mediaId: text("media_id").references(() => media.id),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const media = sqliteTable("media", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	groupId: text("group_id")
		.notNull()
		.references(() => groups.id),
	url: text("url").notNull(),
	type: text("type").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
