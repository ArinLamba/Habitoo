import { useAuth } from "@clerk/expo";
import type { Habit } from "@habitoo/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../../data/query-keys";
import { habitsApi } from "../../api/habits-api";

export function useDeleteHabit() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitId: string) => {
      await habitsApi.deleteHabit(habitId, await getToken());
      return habitId;
    },
    onMutate: async (habitId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.habits }),
        queryClient.cancelQueries({ queryKey: queryKeys.habit(habitId) }),
        queryClient.cancelQueries({ queryKey: ["completions"] }),
        queryClient.cancelQueries({ queryKey: queryKeys.habitLogs(habitId) }),
      ]);

      const previous = queryClient.getQueryData<Habit[]>(queryKeys.habits) ?? [];
      const previousHabit = queryClient.getQueryData<Habit>(
        queryKeys.habit(habitId)
      );
      const previousCompletionQueries =
        queryClient.getQueriesData({ queryKey: ["completions"] });
      const previousLogs = queryClient.getQueryData(
        queryKeys.habitLogs(habitId)
      );

      queryClient.setQueryData<Habit[]>(
        queryKeys.habits,
        previous.filter((habit) => habit.id !== habitId)
      );
      queryClient.removeQueries({ queryKey: queryKeys.habit(habitId) });
      queryClient.removeQueries({ queryKey: queryKeys.habitLogs(habitId) });
      queryClient.setQueriesData(
        { queryKey: ["completions"] },
        (current: unknown) =>
          Array.isArray(current)
            ? current.filter((completion) => completion.habitId !== habitId)
            : current
      );

      return {
        previous,
        previousHabit,
        previousCompletionQueries,
        previousLogs,
      };
    },
    onError: (_error, _habitId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.habits, context.previous);
      }
      if (context?.previousHabit) {
        queryClient.setQueryData(
          queryKeys.habit(context.previousHabit.id),
          context.previousHabit
        );
        queryClient.setQueryData(
          queryKeys.habitLogs(context.previousHabit.id),
          context.previousLogs
        );
      }
      context?.previousCompletionQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: async (_data, _error, habitId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.habits }),
        queryClient.invalidateQueries({ queryKey: queryKeys.habit(habitId) }),
        queryClient.invalidateQueries({ queryKey: ["completions"] }),
      ]);
    },
  });
}
