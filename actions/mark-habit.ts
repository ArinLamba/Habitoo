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
      and(
        eq(hc.habitId, id),
        eq(hc.date, date)
      ),
  });

  if (existing) {
    await db
      .update(habitCompletions)
      .set({ completed: !existing.completed }) // toggle optional
      .where(eq(habitCompletions.id, existing.id));
  } else {
    await db.insert(habitCompletions).values({
      habitId: id,
      date: date,
      completed: true,
    });
  }
};