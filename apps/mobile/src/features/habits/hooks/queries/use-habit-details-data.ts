import { useAuth } from "@clerk/expo";
import { useQueries } from "@tanstack/react-query";

import { queryKeys } from "../../../../data/query-keys";
import { habitsApi } from "../../api/habits-api";

export function useHabitDetailsData(habitId?: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const enabled = isLoaded && !!isSignedIn && !!habitId;

  const [habitQuery, completionsQuery, logsQuery] = useQueries({
    queries: [
      {
        queryKey: queryKeys.habit(habitId ?? ""),
        queryFn: async () => habitsApi.getHabit(habitId!, await getToken()),
        enabled,
      },
      {
        queryKey: queryKeys.habitCompletions(habitId ?? "", "all"),
        queryFn: async () =>
          habitsApi.listHabitCompletions(habitId!, "all", undefined, await getToken()),
        enabled,
      },
      {
        queryKey: queryKeys.habitLogs(habitId ?? ""),
        queryFn: async () => habitsApi.listHabitLogs(habitId!, await getToken()),
        enabled,
      },
    ],
  });

  return {
    habit: habitQuery.data,
    completions: completionsQuery.data ?? [],
    logs: logsQuery.data ?? [],
    isLoading: habitQuery.isLoading || completionsQuery.isLoading || logsQuery.isLoading,
    isFetching: habitQuery.isFetching || completionsQuery.isFetching || logsQuery.isFetching,
    error: habitQuery.error ?? completionsQuery.error ?? logsQuery.error,
    refetch: async () => {
      await Promise.all([
        habitQuery.refetch(),
        completionsQuery.refetch(),
        logsQuery.refetch(),
      ]);
    },
  };
}
