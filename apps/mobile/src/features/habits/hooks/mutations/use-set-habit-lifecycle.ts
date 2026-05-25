import { useAuth } from "@clerk/expo";
import type { Habit, HabitLifecycle } from "@habitoo/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../../data/query-keys";
import { habitsApi } from "../../api/habits-api";

type SetHabitLifecycleInput = {
  habitId: string;
  lifecycle: HabitLifecycle;
};

export function useSetHabitLifecycle() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, lifecycle }: SetHabitLifecycleInput) =>
      habitsApi.updateHabit(habitId, { lifecycle }, await getToken()),
    onMutate: async ({ habitId, lifecycle }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.habits }),
        queryClient.cancelQueries({ queryKey: queryKeys.habit(habitId) }),
      ]);

      const previous = queryClient.getQueryData<Habit[]>(queryKeys.habits) ?? [];
      const previousHabit = queryClient.getQueryData<Habit>(
        queryKeys.habit(habitId)
      );

      queryClient.setQueryData<Habit[]>(
        queryKeys.habits,
        previous.map((habit) =>
          habit.id === habitId ? { ...habit, lifecycle } : habit
        )
      );
      queryClient.setQueryData<Habit>(
        queryKeys.habit(habitId),
        (current) => current ? { ...current, lifecycle } : current
      );

      return { previous, previousHabit };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.habits, context.previous);
      }
      if (context?.previousHabit) {
        queryClient.setQueryData(
          queryKeys.habit(context.previousHabit.id),
          context.previousHabit
        );
      }
    },
    onSuccess: (updatedHabit) => {
      queryClient.setQueryData<Habit[]>(queryKeys.habits, (current = []) =>
        current.map((habit) =>
          habit.id === updatedHabit.id ? updatedHabit : habit
        )
      );
      queryClient.setQueryData(queryKeys.habit(updatedHabit.id), updatedHabit);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}
