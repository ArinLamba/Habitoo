"use server";
import db from "@/db";
import { habitCompletions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm";

export const markHabit = async (id: string, date: string) => {
  const { userId } = await auth();
  if (!userId) return;
  console.log("🔥 DB HIT: markHabit", new Date().toISOString());

  const existing = await db.query.habitCompletions.findFirst({
    where: (hc, { and, eq }) =>
      and(eq(hc.habitId, id), eq(hc.date, date)),
  });

  if (existing) {
    const updated = await db
      .update(habitCompletions)
      .set({ completed: !existing.completed })
      .where(eq(habitCompletions.id, existing.id))
      .returning();

    return updated[0]; // ✅ return updated row
  } else {
    const inserted = await db
      .insert(habitCompletions)
      .values({
        habitId: id,
        date,
        userId,
        completed: true,
      })
      .returning();

    return inserted[0]; // ✅ return new row
  }
};