import type {
  Completion,
  Habit,
  HabitFormValues,
  HabitLifecycle,
  HabitStatus,
} from "@habitoo/core";

import { apiClient } from "../../../data/api-client";

type HabitsResponse = {
  habits: Habit[];
};

type HabitResponse = {
  habit: Habit;
};

type CompletionsResponse = {
  completions: Completion[];
};

type CompletionResponse = {
  completion: Completion | null;
};

type LogsResponse = {
  logs: Completion[];
};

type LogResponse = {
  log: Completion;
};

type DeleteLogsResponse = {
  deletedLogIds: string[];
};

const withQuery = (
  path: string,
  params: Record<string, string | number | undefined>
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
};

export const habitsApi = {
  listHabits: async (token?: string | null) => {
    const response = await apiClient<HabitsResponse>("/api/habits", { token });
    return response.habits;
  },

  createHabit: async (values: HabitFormValues, token?: string | null) => {
    const response = await apiClient<HabitResponse>("/api/habits", {
      token,
      method: "POST",
      body: JSON.stringify(values),
    });

    return response.habit;
  },

  getHabit: async (habitId: string, token?: string | null) => {
    const response = await apiClient<HabitResponse>(`/api/habits/${habitId}`, {
      token,
    });
    return response.habit;
  },

  updateHabit: async (
    habitId: string,
    values: Partial<HabitFormValues> & { lifecycle?: HabitLifecycle },
    token?: string | null
  ) => {
    const response = await apiClient<HabitResponse>(`/api/habits/${habitId}`, {
      token,
      method: "PATCH",
      body: JSON.stringify(values),
    });

    return response.habit;
  },

  deleteHabit: async (habitId: string, token?: string | null) => {
    await apiClient<void>(`/api/habits/${habitId}`, {
      token,
      method: "DELETE",
    });
  },

  listCompletions: async (
    range: number | "all" = 90,
    today?: string,
    token?: string | null
  ) => {
    const response = await apiClient<CompletionsResponse>(
      withQuery("/api/completions", { range, today }),
      { token }
    );

    return response.completions;
  },

  listHabitCompletions: async (
    habitId: string,
    range: number | "all" = 90,
    today?: string,
    token?: string | null
  ) => {
    const response = await apiClient<CompletionsResponse>(
      withQuery(`/api/habits/${habitId}/completions`, { range, today }),
      { token }
    );

    return response.completions;
  },

  setHabitStatus: async (
    habitId: string,
    date: string,
    status: HabitStatus,
    token?: string | null
  ) => {
    const response = await apiClient<CompletionResponse>(
      `/api/habits/${habitId}/status`,
      {
        token,
        method: "POST",
        body: JSON.stringify({ date, status }),
      }
    );

    return response.completion;
  },

  listHabitLogs: async (habitId: string, token?: string | null) => {
    const response = await apiClient<LogsResponse>(
      `/api/habits/${habitId}/logs`,
      { token }
    );

    return response.logs;
  },

  addHabitLog: async (
    habitId: string,
    values: { date: string; value: number; note?: string },
    token?: string | null
  ) => {
    const response = await apiClient<LogResponse>(
      `/api/habits/${habitId}/logs`,
      {
        token,
        method: "POST",
        body: JSON.stringify(values),
      }
    );

    return response.log;
  },

  deleteHabitLogs: async (
    habitId: string,
    logIds: string[],
    token?: string | null
  ) => {
    const query = new URLSearchParams();
    logIds.forEach((id) => query.append("logIds", id));

    const response = await apiClient<DeleteLogsResponse>(
      `/api/habits/${habitId}/logs?${query.toString()}`,
      {
        token,
        method: "DELETE",
        body: JSON.stringify({ logIds }),
      }
    );

    return response.deletedLogIds;
  },
};
