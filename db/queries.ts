"use server";
import db from "@/db/index";
import { habitCompletions, habits } from "@/db/schema";
import { formatDate } from "@/lib/date";
import { getUserId } from "@/lib/get-user-id";

import { and, eq, gte, lte } from "drizzle-orm";

import { cache } from "react";

// /db/queries.ts

export const getCompletions = async (range: number | "all", clientTodayStr?: string) => {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  
  console.log("🔥 DB HIT: getCompletions", new Date().toISOString());

  if (range === "all") {
    return db
      .select()
      .from(habitCompletions)
      .where(eq(habitCompletions.userId, userId));
  }

  // 1. Create a reference date from the client string
  // We add 'T00:00:00' to prevent the server from shifting the date
  const referenceDate = clientTodayStr 
    ? new Date(`${clientTodayStr}T00:00:00`) 
    : new Date();

  // 2. Calculate the 'past' date based on the range
  const past = new Date(referenceDate);
  past.setDate(past.getDate() - range);

  // 3. Format them back to YYYY-MM-DD strings for the DB query
  const todayStr = formatDate(referenceDate);
  const pastStr = formatDate(past);

  const completions = db.query.habitCompletions.findMany({
    where: (
      and(
        eq(habitCompletions.userId, userId),
        gte(habitCompletions.date, pastStr),
        lte(habitCompletions.date, todayStr)
      )
    ),
  });

  return completions;
}

// TODO: make a separate order column because it will be helpful in drag and drop later 

export const getHabits = cache(async () => {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized") ;

  console.log("🔥 DB HIT: getHabits", new Date().toISOString());

  const data = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
    orderBy: (habits, { asc }) => [
      asc(habits.createdAt),
      asc(habits.id)
    ],
  });
  return data;
});

export const getNoteByDate = cache(async (date: string) => {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  console.log("🔥 DB HIT: getNoteByDate", new Date().toISOString());

  const note = await db.query.dailyNotes.findFirst({
    where: (dn, { and, eq }) =>
      and(eq(dn.userId, userId), eq(dn.date, date)),
  });

  return note;
});

export const getHabitById = cache(async (
  habitId: string
) => {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }
  if (!habitId || habitId.trim() === "") {
    return null; // ⛔ STOP HERE
  }
  console.log("🔥 DB HIT: getHabitById", new Date().toISOString());
  const habit = await db.query.habits.findFirst({
    where: 
      and(
        eq(habits.id, habitId),
        eq(habits.userId, userId)
      ),
  });

  return habit;
});

export const getCompletionsByHabitId = cache(async(habitId: string, range: number | "all", clientTodayStr?: string) => {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  
  console.log("🔥 DB HIT: getCompletionsByHabitId", new Date().toISOString());

  if (range === "all") {
    const completionsById = db.query.habitCompletions.findMany({
      where: (
        and(
          eq(habitCompletions.userId, userId),
          eq(habitCompletions.habitId, habitId),
        )
      ),
    });
    return completionsById;
  };
  // 1. Create a reference date from the client string
  // We add 'T00:00:00' to prevent the server from shifting the date
  const referenceDate = clientTodayStr 
    ? new Date(`${clientTodayStr}T00:00:00`) 
    : new Date();

  // 2. Calculate the 'past' date based on the range
  const past = new Date(referenceDate);
  past.setDate(past.getDate() - range);

  // 3. Format them back to YYYY-MM-DD strings for the DB query
  const todayStr = formatDate(referenceDate);
  const pastStr = formatDate(past);

  const completionsById = db.query.habitCompletions.findMany({
    where: (
      and(
        eq(habitCompletions.habitId, habitId),
        eq(habitCompletions.userId, userId),
        gte(habitCompletions.date, pastStr),
        lte(habitCompletions.date, todayStr),
      )
    ),
  });

  return completionsById;
});

