import { NextResponse } from "next/server";

import { getCompletionsByHabitId } from "@/db/queries";

import { serverError, unauthorized } from "../../../_lib/responses";

type RouteContext = {
  params: Promise<{
    habitId: string;
  }>;
};

const parseRange = (value: string | null): number | "all" => {
  if (!value || value === "all") return "all";

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 90;
};

export const GET = async (req: Request, context: RouteContext) => {
  try {
    const { habitId } = await context.params;
    const url = new URL(req.url);
    const range = parseRange(url.searchParams.get("range"));
    const today = url.searchParams.get("today") ?? undefined;

    const completions = await getCompletionsByHabitId(habitId, range, today);

    return NextResponse.json({ completions });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }

    return serverError();
  }
};
