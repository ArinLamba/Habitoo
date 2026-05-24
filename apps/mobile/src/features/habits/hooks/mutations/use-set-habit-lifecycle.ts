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
      await queryClient.cancelQueries({ queryKey: queryKeys.habits });

      const previous = queryClient.getQueryData<Habit[]>(queryKeys.habits) ?? [];

      queryClient.setQueryData<Habit[]>(
        queryKeys.habits,
        previous.map((habit) =>
          habit.id === habitId ? { ...habit, lifecycle } : habit
        )
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.habits, context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}
