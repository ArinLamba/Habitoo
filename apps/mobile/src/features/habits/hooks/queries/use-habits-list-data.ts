import { useAuth } from "@clerk/expo";
import { keepPreviousData, useQueries } from "@tanstack/react-query";

import { queryKeys } from "../../../../data/query-keys";
import { habitsApi } from "../../api/habits-api";

export function useHabitsListData(selectedDate: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const enabled = isLoaded && !!isSignedIn;

  const [habitsQuery, completionsQuery] = useQueries({
    queries: [
      {
        queryKey: queryKeys.habits,
        queryFn: async () => habitsApi.listHabits(await getToken()),
        enabled,
        placeholderData: keepPreviousData,
        staleTime: 30_000,
      },
      {
        queryKey: queryKeys.completions("all", selectedDate),
        queryFn: async () =>
          habitsApi.listCompletions("all", selectedDate, await getToken()),
        enabled,
        placeholderData: keepPreviousData,
        staleTime: 10_000,
      },
    ],
  });

  return {
    habitsQuery,
    completionsQuery,
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
