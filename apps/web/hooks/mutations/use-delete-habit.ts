// /hooks/mutations/use-delete-habit.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHabit } from "@/server/actions/delete-habit";
import { Habit } from "@/lib/types";

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHabit,

    onMutate: async (habitId: string) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });

      const prev = queryClient.getQueryData(["habits"]);

      queryClient.setQueryData(["habits"], (old: Habit[] = []) =>
        old.filter((h) => h.id !== habitId)
      );

      return { prev };
    },

    onError: (_, __, ctx) => {
      queryClient.setQueryData(["habits"], ctx?.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};