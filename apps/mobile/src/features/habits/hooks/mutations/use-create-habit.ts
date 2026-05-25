import { useAuth } from "@clerk/expo";
import type { Habit, HabitFormValues } from "@habitoo/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../../data/query-keys";
import { habitsApi } from "../../api/habits-api";

export function useCreateHabit() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: HabitFormValues) =>
      habitsApi.createHabit(values, await getToken()),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.habits });

      const previous = queryClient.getQueryData<Habit[]>(queryKeys.habits) ?? [];
      const optimisticId = `optimistic-${Date.now()}`;
      const now = new Date().toISOString();
      const optimisticHabit: Habit = {
        ...values,
        id: optimisticId,
        lifecycle: "active",
        userId: "optimistic",
        createdAt: now,
        updatedAt: now,
      };

      queryClient.setQueryData<Habit[]>(queryKeys.habits, [
        ...previous,
        optimisticHabit,
      ]);

      return { previous, optimisticId };
    },
    onError: (_error, _values, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.habits, context.previous);
      }
    },
    onSuccess: (createdHabit, _values, context) => {
      queryClient.setQueryData<Habit[]>(queryKeys.habits, (current = []) => {
        const withoutOptimistic = current.filter(
          (habit) => habit.id !== context?.optimisticId
        );

        if (withoutOptimistic.some((habit) => habit.id === createdHabit.id)) {
          return withoutOptimistic.map((habit) =>
            habit.id === createdHabit.id ? createdHabit : habit
          );
        }

        return [...withoutOptimistic, createdHabit];
      });
      queryClient.setQueryData(queryKeys.habit(createdHabit.id), createdHabit);
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.habits }),
        queryClient.invalidateQueries({ queryKey: ["completions"] }),
      ]);
    },
  });
}
