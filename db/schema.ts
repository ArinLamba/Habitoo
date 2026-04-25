import {
  pgTable,
  uuid,
  text,
  boolean,
  date,
  timestamp,
  index
} from "drizzle-orm/pg-core";

// 🧩 HABITS
export const habits = pgTable("habits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ COMPLETIONS (CORE TABLE)
export const habitCompletions = pgTable("habit_completions", {
    id: uuid("id").primaryKey().defaultRandom(),
    habitId: uuid("habit_id")
      .references(() => habits.id, {onDelete: "cascade"})
      .notNull(),
    date: date("date").notNull(),
    completed: boolean("completed").default(true),
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (table) => ({
    habitDateIdx: index("habit_date_idx").on(table.habitId, table.date),
  })
);

// ✍️ DAILY NOTES
export const dailyNotes = pgTable("daily_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  date: date("date").notNull(),
  note: text("note"),
  highlight: text("highlight"),
});