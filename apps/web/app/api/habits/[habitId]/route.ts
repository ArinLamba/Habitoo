import { habitFormSchema, habitLifecycles } from "@habitoo/core";
import { NextResponse } from "next/server";
import * as z from "zod";

import { getHabitById } from "@/db/queries";
import { getUserId } from "@/lib/get-user-id";
import {
  removeHabit,
  updateHabit,
  updateHabitLifecycle,
} from "@/server/services/habits";

import {
  badRequest,
  notFound,
  serverError,
  unauthorized,
} from "../../_lib/responses";

type RouteContext = {
  params: Promise<{
    habitId: string;
  }>;
};

const patchHabitSchema = habitFormSchema.partial().extend({
  lifecycle: z.enum(habitLifecycles).optional(),
});

export const GET = async (_req: Request, context: RouteContext) => {
  try {
    const { habitId } = await context.params;
    const habit = await getHabitById(habitId);

    if (!habit) {
      return notFound("Habit not found");
    }

    return NextResponse.json({ habit });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }

    return serverError();
  }
};

export const PATCH = async (req: Request, context: RouteContext) => {
  const userId = await getUserId();

  if (!userId) {
    return unauthorized();
  }

  const { habitId } = await context.params;
  const parsed = patchHabitSchema.safeParse(await req.json());

  if (!parsed.success) {
    return badRequest("Invalid habit payload");
  }

  const { lifecycle, ...habitData } = parsed.data;

  const habit = lifecycle
    ? await updateHabitLifecycle(userId, habitId, lifecycle)
    : await updateHabit(userId, habitId, habitData);

  return NextResponse.json({ habit });
};

export const DELETE = async (_req: Request, context: RouteContext) => {
  const userId = await getUserId();

  if (!userId) {
    return unauthorized();
  }

  const { habitId } = await context.params;
  await removeHabit(userId, habitId);

  return new NextResponse(null, { status: 204 });
};
