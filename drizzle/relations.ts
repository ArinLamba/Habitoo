import { relations } from "drizzle-orm/relations";
import { habits, habitCompletions } from "./schema";

export const habitCompletionsRelations = relations(habitCompletions, ({one}) => ({
	habit: one(habits, {
		fields: [habitCompletions.habitId],
		references: [habits.id]
	}),
}));

export const habitsRelations = relations(habits, ({many}) => ({
	habitCompletions: many(habitCompletions),
}));