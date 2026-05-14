// /hooks/mutations/use-edit-habit.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editHabit } from "@/server/actions/edit-habit";
import { Habit } from "@/lib/types";

import { HabitFormValues } from "@/lib/types";

type EditHabitPayload = {
  id: string;
  data: HabitFormValues;
};

export const useEditHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: EditHabitPayload) =>
      editHabit(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });
      await queryClient.cancelQueries({ queryKey: ["habit", id] });

      const prevHabits = queryClient.getQueryData(["habits"]);
      const prevHabit = queryClient.getQueryData(["habit", id]);

      queryClient.setQueryData(["habits"], (old: Habit[] = []) =>
        old.map((h) =>
          h.id === id ? { ...h, ...data } : h
        )
      );

      queryClient.setQueryData(
        ["habit", id],
        (old: Habit | undefined) =>
          old ? { ...old, ...data } : old
      );

      return { prevHabits, prevHabit };
    },

    onError: (_err, vars, ctx) => {
      queryClient.setQueryData(["habits"], ctx?.prevHabits);

      queryClient.setQueryData(
        ["habit", vars.id],
        ctx?.prevHabit
      );
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["habits"],
      });

      queryClient.invalidateQueries({
        queryKey: ["habit", vars.id],
      });
    },
  });
};