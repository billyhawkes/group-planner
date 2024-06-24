import { relations } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: text("id").notNull().primaryKey(),
	email: text("email", {
		length: 254,
	})
		.unique()
		.notNull(),
	googleId: text("google_id").unique().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	usersToGroups: many(usersToGroups),
}));

export const sessions = sqliteTable("sessions", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id").notNull(),
	expiresAt: integer("expires_at").notNull(),
});

export const usersToGroups = sqliteTable(
	"users_to_groups",
	{
		userId: text("user_id").notNull(),
		groupId: text("group_id").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.groupId] }),
	})
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one, many }) => ({
	user: one(users, {
		fields: [usersToGroups.userId],
		references: [users.id],
	}),
	group: one(groups, {
		fields: [usersToGroups.groupId],
		references: [groups.id],
	}),
}));

export const groups = sqliteTable("groups", {
	id: text("id").notNull().primaryKey(),
	name: text("name").notNull(),
});

export const groupsRelations = relations(groups, ({ one, many }) => ({
	usersToGroups: many(usersToGroups),
}));

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
