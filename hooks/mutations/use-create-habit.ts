// /hooks/mutations/use-create-habit.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertNewHabit } from "@/actions/add-habit";
import { Habit } from "@/lib/types";

export const useCreateHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertNewHabit,

    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });

      const prev = queryClient.getQueryData(["habits"]);

      const tempId = crypto.randomUUID();

      queryClient.setQueryData(["habits"], (old: Habit[] = []) => [
        ...old,
        {
          id: tempId,
          name,
          createdAt: new Date().toISOString(),
        },
      ]);

      return { prev, tempId };
    },

    onError: (_, __, ctx) => {
      queryClient.setQueryData(["habits"], ctx?.prev);
    },

    onSuccess: (realHabit, _, ctx) => {
      queryClient.setQueryData(["habits"], (old: Habit[] = []) =>
        old.map((h) =>
          h.id === ctx?.tempId ? realHabit : h
        )
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};