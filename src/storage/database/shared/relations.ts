import { relations } from "drizzle-orm/relations";
import { topics, contents } from "./schema";

export const contentsRelations = relations(contents, ({one}) => ({
	topic: one(topics, {
		fields: [contents.topicId],
		references: [topics.id]
	}),
}));

export const topicsRelations = relations(topics, ({many}) => ({
	contents: many(contents),
}));