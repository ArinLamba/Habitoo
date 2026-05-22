import { HABIT_STATUS } from "@habitoo/core";
import { NextResponse } from "next/server";
import * as z from "zod";

import { getUserId } from "@/lib/get-user-id";
import { setHabitStatus } from "@/server/services/set-habit-status";

import {
  badRequest,
  serverError,
  unauthorized,
} from "../../../_lib/responses";

type RouteContext = {
  params: Promise<{
    habitId: string;
  }>;
};

const setHabitStatusSchema = z.object({
  date: z.string().min(1),
  status: z
    .enum([
      HABIT_STATUS.COMPLETED,
      HABIT_STATUS.SKIPPED,
      HABIT_STATUS.FAILED,
    ])
    .nullable(),
});

export const POST = async (req: Request, context: RouteContext) => {
  const userId = await getUserId();

  if (!userId) {
    return unauthorized();
  }

  const parsed = setHabitStatusSchema.safeParse(await req.json());

  if (!parsed.success) {
    return badRequest("Invalid habit status payload");
  }

  const { habitId } = await context.params;

  try {
    const completion = await setHabitStatus(
      userId,
      habitId,
      parsed.data.date,
      parsed.data.status
    );

    return NextResponse.json({ completion });
  } catch (error) {
    if (error instanceof Error && error.message === "Habit not found") {
      return badRequest("Habit not found");
    }

    return serverError();
  }
};
