import { NextResponse } from "next/server";
import * as z from "zod";

import { getHabitLogs } from "@/db/queries";
import { getUserId } from "@/lib/get-user-id";
import { createHabitLog, deleteHabitLogs } from "@/server/services/habit-logs";

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

const createHabitLogSchema = z.object({
  date: z.string().min(1),
  value: z.number().positive(),
  note: z.string().optional(),
});

const deleteHabitLogsSchema = z.object({
  logIds: z.array(z.string().min(1)).min(1).max(100),
});

export const GET = async (_req: Request, context: RouteContext) => {
  const userId = await getUserId();

  if (!userId) {
    return unauthorized();
  }

  const { habitId } = await context.params;
  const logs = await getHabitLogs(habitId, userId);

  return NextResponse.json({ logs });
};

export const POST = async (req: Request, context: RouteContext) => {
  const userId = await getUserId();

  if (!userId) {
    return unauthorized();
  }

  const parsed = createHabitLogSchema.safeParse(await req.json());

  if (!parsed.success) {
    return badRequest("Invalid habit log payload");
  }

  const { habitId } = await context.params;

  try {
    const log = await createHabitLog({
      habitId,
      userId,
      ...parsed.data,
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Habit not found") {
      return badRequest("Habit not found");
    }

    return serverError();
  }
};

export const DELETE = async (req: Request, context: RouteContext) => {
  const userId = await getUserId();

  if (!userId) {
    return unauthorized();
  }

  const url = new URL(req.url);
  const queryLogIds = url.searchParams.getAll("logIds");
  let body: unknown = {};

  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const parsed = deleteHabitLogsSchema.safeParse(
    queryLogIds.length > 0 ? { logIds: queryLogIds } : body
  );

  if (!parsed.success) {
    return badRequest("Invalid log delete payload");
  }

  const { habitId } = await context.params;

  try {
    const deletedLogs = await deleteHabitLogs({
      habitId,
      userId,
      logIds: parsed.data.logIds,
    });

    return NextResponse.json({ deletedLogIds: deletedLogs.map((log) => log.id) });
  } catch (error) {
    if (error instanceof Error && error.message === "Habit not found") {
      return badRequest("Habit not found");
    }

    return serverError();
  }
};
