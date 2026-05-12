import { pgTable, uuid, text, date, index, foreignKey, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const habitStatus = pgEnum("habit_status", ['completed', 'skipped', 'failed'])


export const dailyNotes = pgTable("daily_notes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	date: date().notNull(),
	note: text(),
	highlight: text(),
});

export const habitCompletions = pgTable("habit_completions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	habitId: uuid("habit_id").notNull(),
	userId: text("user_id").notNull(),
	date: date().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }).defaultNow().notNull(),
	status: habitStatus().default('completed'),
}, (table) => [
	index("habit_date_idx").using("btree", table.habitId.asc().nullsLast().op("date_ops"), table.date.asc().nullsLast().op("date_ops")),
	foreignKey({
			columns: [table.habitId],
			foreignColumns: [habits.id],
			name: "habit_completions_habit_id_habits_id_fk"
		}).onDelete("cascade"),
]);

export const habits = pgTable("habits", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	startDate: date("start_date").notNull(),
});
