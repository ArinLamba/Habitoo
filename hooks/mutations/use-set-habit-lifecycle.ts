import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setHabitLifecycle } from "@/server/actions/set-habit-lifecycle";
import { Habit } from "@/lib/types";

type Payload = {
  id: string;
  lifecycle: Habit["lifecycle"];
};

export const useSetHabitLifecycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, lifecycle }: Payload) =>
      setHabitLifecycle(id, lifecycle),

    onMutate: async ({ id, lifecycle }) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });
      await queryClient.cancelQueries({ queryKey: ["habit", id] });

      const prevHabits = queryClient.getQueryData(["habits"]);
      const prevHabit = queryClient.getQueryData(["habit", id]);

      queryClient.setQueryData(["habits"], (old: Habit[] = []) =>
        old.map((habit) =>
          habit.id === id
            ? { ...habit, lifecycle }
            : habit
        )
      );

      queryClient.setQueryData(
        ["habit", id],
        (old: Habit | undefined) =>
          old ? { ...old, lifecycle } : old
      );

      return { prevHabits, prevHabit };
    },

    onError: (_err, vars, ctx) => {
      queryClient.setQueryData(["habits"], ctx?.prevHabits);
      queryClient.setQueryData(["habit", vars.id], ctx?.prevHabit);
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["habit", vars.id] });
    },
  });
};
