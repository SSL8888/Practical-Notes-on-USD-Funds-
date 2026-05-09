import { pgTable, serial, timestamp, index, unique, varchar, text, integer, foreignKey, jsonb, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const topics = pgTable("topics", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	slug: varchar({ length: 100 }).notNull(),
	title: varchar({ length: 200 }).notNull(),
	icon: varchar({ length: 50 }).notNull(),
	description: text().notNull(),
	priority: integer().default(0).notNull(),
	contentCount: integer("content_count").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("topics_priority_idx").using("btree", table.priority.asc().nullsLast().op("int4_ops")),
	index("topics_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	unique("topics_slug_key").on(table.slug),
]);

export const contents = pgTable("contents", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	slug: varchar({ length: 100 }).notNull(),
	title: varchar({ length: 300 }).notNull(),
	titleEn: varchar("title_en", { length: 300 }),
	summary: text().notNull(),
	content: text().notNull(),
	topicId: varchar("topic_id", { length: 36 }).notNull(),
	cardType: varchar("card_type", { length: 50 }).default('hot').notNull(),
	tags: jsonb().default([]),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("contents_card_type_idx").using("btree", table.cardType.asc().nullsLast().op("text_ops")),
	index("contents_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("contents_topic_id_idx").using("btree", table.topicId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.topicId],
			foreignColumns: [topics.id],
			name: "contents_topic_id_fkey"
		}),
	unique("contents_slug_key").on(table.slug),
]);

export const adminUsers = pgTable("admin_users", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("admin_users_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	unique("admin_users_email_key").on(table.email),
]);

export const glossaries = pgTable("glossaries", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	term: varchar({ length: 200 }).notNull(),
	termEn: varchar("term_en", { length: 200 }).notNull(),
	definition: text().notNull(),
	relatedTerms: jsonb("related_terms").default([]),
	relatedContent: jsonb("related_content").default([]),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
