"use server";
import db from "@/db/index";
import { habitCompletions } from "@/db/schema";

import { auth } from "@clerk/nextjs/server";

import { cache } from "react";

export const getCompletions = cache(async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  console.log("🔥 DB HIT: getCompletions", new Date().toISOString());
  
  const data = await db.select().from(habitCompletions);
  return data;
});

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