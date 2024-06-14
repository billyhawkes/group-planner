import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: text("id").notNull().primaryKey(),
});

export const sessions = sqliteTable("sessions", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id").notNull(),
	expiresAt: integer("expires_at").notNull(),
});

export const usersToGroups = sqliteTable("users_to_groups", {
	userId: text("user_id").notNull(),
	groupId: text("group_id").notNull(),
});

export const groups = sqliteTable("groups", {
	id: text("id").notNull().primaryKey(),
	name: text("name").notNull(),
});

export const messages = sqliteTable("messages", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id").notNull(),
	groupId: text("group_id").notNull(),
	content: text("content").notNull(),
	mediaId: text("media_id"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const media = sqliteTable("media", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id").notNull(),
	groupId: text("group_id").notNull(),
	type: text("type").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
