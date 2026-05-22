import {
  pgTable,
  uuid,
  text,
  date,
  timestamp,
  index,
  pgEnum,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

// =========================
// ENUMS
// =========================

export const completionStatusEnum = pgEnum(
  "completion_status",
  ["completed", "skipped", "failed"]
);

export const habitLifecycleEnum = pgEnum(
  "habit_lifecycle",
  ["active", "completed", "archived"]
);

export const habitFrequencyEnum = pgEnum(
  "habit_frequency",
  ["day", "week", "month", "year"]
);

// =========================
// HABITS
// =========================

export const habits = pgTable("habits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  lifecycle: habitLifecycleEnum("lifecycle")
    .default("active")
    .notNull(),
  startDate: date("start_date").notNull(),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value"),
  unit: text("unit"),
  frequency: habitFrequencyEnum("frequency")
    .default("day")
    .notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

// =========================
// HABIT COMPLETIONS / LOGS
// =========================

export const habitCompletions = pgTable("habit_completions",{
  id: uuid("id").primaryKey().defaultRandom(),
  habitId: uuid("habit_id")
    .references(() => habits.id, {
      onDelete: "cascade",
    })
    .notNull(),
  userId: text("user_id").notNull(),
  date: date("date").notNull(),
  status: completionStatusEnum("status")
    .default("completed")
    .notNull(),
  // for measurable habits
  value: numeric("value"),
  note: text("note"),
  completedAt: timestamp("completed_at")
    .defaultNow()
    .notNull(),
},
  (table) => ({
    habitDateIdx: index("habit_date_idx")
      .on(table.habitId, table.date),
   })
);

// =========================
// DAILY NOTES
// =========================

export const dailyNotes = pgTable("daily_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  date: date("date").notNull(),
  note: text("note"),
  highlight: text("highlight"),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});