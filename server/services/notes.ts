import db from "@/db";

import { dailyNotes } from "@/db/schema";

import { and, eq } from "drizzle-orm";

export const saveNote = async (
  userId: string,
  date: string,
  note: string,
  highlight: string
) => {
  const existing =
    await db.query.dailyNotes.findFirst({
      where: (dn, { and, eq }) =>
        and(
          eq(dn.userId, userId),
          eq(dn.date, date)
        ),
    });

  if (existing) {
    await db
      .update(dailyNotes)
      .set({
        note,
        highlight,
      })
      .where(
        and(
          eq(dailyNotes.id, existing.id),
          eq(dailyNotes.userId, userId)
        )
      );

    return;
  }

  await db.insert(dailyNotes).values({
    userId,
    date,
    note,
    highlight,
  });
};