import { useAuth } from "@clerk/expo";
import { formatDate } from "@habitoo/core";
import { useQueries } from "@tanstack/react-query";

import { queryKeys } from "../../../data/query-keys";
import { habitsApi } from "../../habits/api/habits-api";

export function useAnalyticsData() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const enabled = isLoaded && !!isSignedIn;
  const today = formatDate(new Date());

  const [habitsQuery, completionsQuery] = useQueries({
    queries: [
      {
        queryKey: queryKeys.habits,
        queryFn: async () => habitsApi.listHabits(await getToken()),
        enabled,
      },
      {
        queryKey: queryKeys.completions(365, today),
        queryFn: async () =>
          habitsApi.listCompletions(365, today, await getToken()),
        enabled,
      },
    ],
  });

  return {
    habits: habitsQuery.data ?? [],
    completions: completionsQuery.data ?? [],
    isLoading: habitsQuery.isLoading || completionsQuery.isLoading,
    isFetching: habitsQuery.isFetching || completionsQuery.isFetching,
    error: habitsQuery.error ?? completionsQuery.error,
    refetch: async () => {
      await Promise.all([habitsQuery.refetch(), completionsQuery.refetch()]);
    },
  };
}
