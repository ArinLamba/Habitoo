// /hooks/mutations/use-edit-habit.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editHabit } from "@/actions/edit-habit";

export const useEditHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      editHabit(id, name),

    onMutate: async ({ id, name }) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });

      const prev = queryClient.getQueryData(["habits"]);

      queryClient.setQueryData(["habits"], (old: any[] = []) =>
        old.map((h) => (h.id === id ? { ...h, name } : h))
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