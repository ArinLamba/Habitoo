"use server";
import db from "@/db/index";
import { habitCompletions } from "@/db/schema";
import { formatDate, getToday } from "@/lib/date";

import { auth } from "@clerk/nextjs/server";
import { and, eq, gte, lte } from "drizzle-orm";

import { cache } from "react";

export const getCompletions = async (range: number | "all") => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  console.log("🔥 DB HIT: getCompletions", new Date().toISOString());

  if (range === "all") {
    return db
      .select()
      .from(habitCompletions)
      .where(eq(habitCompletions.userId, userId));
  }

  const today = new Date(); // 🔥 use real Date, not string
  today.setHours(0, 0, 0, 0);

  const past = new Date(today);
  past.setDate(past.getDate() - range);

  const todayStr = formatDate(today);
  const pastStr = formatDate(past);

  const data = await db
    .select()
    .from(habitCompletions)
    .where(
      and(
        eq(habitCompletions.userId, userId),
        gte(habitCompletions.date, pastStr),
        lte(habitCompletions.date, todayStr)
      )
    );

  return data;
};

export const getRecentCompletions = cache(async (range: number | "all") => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  console.log("🔥 DB HIT: getRecentCompletions", new Date().toISOString());
  if(range === "all") {
    return db.select().from(habitCompletions);
  }

  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - range);

  const data = await db
    .select()
    .from(habitCompletions)
    .where(
      and(
        eq(habitCompletions.userId, userId),
        gte(habitCompletions.date, formatDate(past)),
        lte(habitCompletions.date, formatDate(today))
      )
    );

  return data;
  }
);

// TODO: make a separate order column because it will be helpful in drag and drop later 

export const getHabits = cache(async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized") ;

  console.log("🔥 DB HIT: getHabits", new Date().toISOString());

  const data = await db.query.habits.findMany({
    orderBy: (habits, { asc }) => [
      asc(habits.createdAt),
      asc(habits.id)
    ],
  });
  return data;
});

export const getNoteByDate = cache(async (date: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  console.log("🔥 DB HIT: getNoteByDate", new Date().toISOString());

  const note = await db.query.dailyNotes.findFirst({
    where: (dn, { and, eq }) =>
      and(eq(dn.userId, userId), eq(dn.date, date)),
  });

  return note;
});

// export const getUserId = async () => {
//   const { userId } = await auth();
//   return userId;
// }