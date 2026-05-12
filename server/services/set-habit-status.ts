import db from "@/db";

import {
  habitCompletions,
} from "@/db/schema";

import { eq } from "drizzle-orm";

export const setHabitStatus = async (
  userId: string,
  habitId: string,
  date: string,
  status: "completed" | "skipped" | "failed" | null,
) => {

  // Security check
  const habit = await db.query.habits.findFirst({
    where: (h, { and, eq }) =>
      and(
        eq(h.id, habitId),
        eq(h.userId, userId)
      ),
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  const existing = await db.query.habitCompletions.findFirst({
    where: (hc, { and, eq }) =>
      and(
        eq(hc.habitId, habitId),
        eq(hc.date, date),
        eq(hc.userId, userId)
      ),
  });

  // CLEAR
  if (status === null) {

    if (!existing) return null;

    await db
      .delete(habitCompletions)
      .where(eq(habitCompletions.id, existing.id));

    return null;
  }

  if (existing) {
    const updated = await db
      .update(habitCompletions)
      .set({ status })
      .where(eq(habitCompletions.id, existing.id))
      .returning();

    return updated[0];
  }

  const inserted = await db
    .insert(habitCompletions)
    .values({
      habitId,
      date,
      userId,
      status
    })
    .returning();

  return inserted[0];
};