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
      await queryClient.cancelQueries({ queryKey: queryKeys.habits });

      const previous = queryClient.getQueryData<Habit[]>(queryKeys.habits) ?? [];

      queryClient.setQueryData<Habit[]>(
        queryKeys.habits,
        previous.filter((habit) => habit.id !== habitId)
      );

      return { previous };
    },
    onError: (_error, _habitId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.habits, context.previous);
      }
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
