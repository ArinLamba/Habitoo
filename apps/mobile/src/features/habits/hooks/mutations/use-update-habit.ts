import { useAuth } from "@clerk/expo";
import type { Habit, HabitFormValues } from "@habitoo/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../../data/query-keys";
import { habitsApi } from "../../api/habits-api";

type UpdateHabitInput = {
  habitId: string;
  values: Partial<HabitFormValues>;
};

export function useUpdateHabit() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, values }: UpdateHabitInput) =>
      habitsApi.updateHabit(habitId, values, await getToken()),
    onMutate: async ({ habitId, values }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.habits });

      const previous = queryClient.getQueryData<Habit[]>(queryKeys.habits) ?? [];

      queryClient.setQueryData<Habit[]>(
        queryKeys.habits,
        previous.map((habit) =>
          habit.id === habitId ? { ...habit, ...values } : habit
        )
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.habits, context.previous);
      }
    },
    onSettled: async (_data, _error, { habitId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.habits }),
        queryClient.invalidateQueries({ queryKey: queryKeys.habit(habitId) }),
      ]);
    },
  });
}
