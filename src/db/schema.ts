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
	name: text("name"),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	usersToGroups: many(usersToGroups),
	messages: many(messages),
	media: many(media),
	events: many(events),
	userToEvents: many(userToEvents),
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
		role: text("role").notNull().default("member"),
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
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const messagesRelations = relations(messages, ({ one, many }) => ({
	user: one(users, {
		fields: [messages.userId],
		references: [users.id],
	}),
}));

export const media = sqliteTable("media", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id").notNull(),
	groupId: text("group_id").notNull(),
	type: text("type").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const mediaRelations = relations(media, ({ one, many }) => ({
	user: one(users, {
		fields: [media.userId],
		references: [users.id],
	}),
	group: one(groups, {
		fields: [media.groupId],
		references: [groups.id],
	}),
}));

export const userToEvents = sqliteTable(
	"user_to_events",
	{
		userId: text("user_id").notNull(),
		eventId: text("event_id").notNull(),
		accepted: integer("id", { mode: "boolean" }),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.eventId] }),
	})
);

export const userToEventsRelations = relations(userToEvents, ({ one, many }) => ({
	user: one(users, {
		fields: [userToEvents.userId],
		references: [users.id],
	}),
	event: one(events, {
		fields: [userToEvents.eventId],
		references: [events.id],
	}),
}));

export const events = sqliteTable("events", {
	id: text("id").notNull().primaryKey(),
	groupId: text("group_id").notNull(),
	userId: text("user_id").notNull(),
	name: text("name").notNull(),
	description: text("description"),
	startsAt: integer("starts_at", { mode: "timestamp" }).notNull(),
	endsAt: integer("ends_at", { mode: "timestamp" }).notNull(),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
	userToEvents: many(userToEvents),
	group: one(groups, {
		fields: [events.groupId],
		references: [groups.id],
	}),
	user: one(users, {
		fields: [events.userId],
		references: [users.id],
	}),
}));
