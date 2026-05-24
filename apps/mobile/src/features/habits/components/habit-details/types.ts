import type { buildHabitStats } from "@habitoo/core";

export type HabitAnalytics = NonNullable<ReturnType<typeof buildHabitStats>>;
