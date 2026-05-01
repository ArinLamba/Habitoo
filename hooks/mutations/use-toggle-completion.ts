import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markHabit } from "@/actions/mark-habit";
import { Completion } from "@/lib/types";
import { useRangeStore } from "@/store/use-range-store";

export const useToggleCompletion = () => {
  const queryClient = useQueryClient();
  const range = useRangeStore(s => s.range);

  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) =>
      markHabit(habitId, date),

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async ({ habitId, date }) => {
      
      const key = ["completions", range];

      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData(key);

      // ✅ update monthly
      queryClient.setQueryData(["completions", range], (old: Completion[] = []) => {
        const index = old.findIndex(
          (c) => c.habitId === habitId && c.date === date
        );

        if (index !== -1) {
          const updated = [...old];
          updated[index] = {
            ...updated[index],
            completed: !updated[index].completed,
          };
          return updated;
        }

        return [...old, { habitId, date, completed: true }];
      });


      return { previous, key };
    },

    // ❌ ROLLBACK if error
    onError: (_err, variables, context) => {
      if (!context) return;

      queryClient.setQueryData(
        context.key,
        context.previous
      );
    },

    // 🔄 SYNC WITH SERVER
    // onSettled: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["completions"]
    //   });
    // },
  });
};