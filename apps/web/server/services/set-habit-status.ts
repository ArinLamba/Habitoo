"use server";

import db from "@/db";

import { habitCompletions } from "@/db/schema";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const dayFilter = (
  userId: string,
  habitId: string,
  date: string
) =>
  and(
    eq(habitCompletions.habitId, habitId),
    eq(habitCompletions.date, date),
    eq(habitCompletions.userId, userId)
  );

export const setHabitStatus = async (
  userId: string,
  habitId: string,
  date: string,
  status: "completed" | "skipped" | "failed" | null
) => {
  const habit = await db.query.habits.findFirst({
    where: (h, { and, eq }) =>
      and(eq(h.id, habitId), eq(h.userId, userId)),
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  const filter = dayFilter(userId, habitId, date);

  // Clear the whole day (status-only rows and numeric logs).
  if (status === null) {
    await db.delete(habitCompletions).where(filter);

    revalidatePath(`/habits/${habitId}`);

    return null;
  }

  // Skip / fail / binary complete replace the day so value logs cannot linger.
  await db.delete(habitCompletions).where(filter);

  const inserted = await db
    .insert(habitCompletions)
    .values({
      habitId,
      date,
      userId,
      status,
    })
    .returning();

  revalidatePath(`/habits/${habitId}`);

  return inserted[0];
};
