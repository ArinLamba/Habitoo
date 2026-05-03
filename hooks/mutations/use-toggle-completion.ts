import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markHabit } from "@/actions/mark-habit";
import { Completion } from "@/lib/types";
import { useRangeStore } from "@/store/use-range-store";

// /hooks/mutations/use-toggle-completion.ts

export const useToggleCompletion = () => {
  const queryClient = useQueryClient();
  const range = useRangeStore(s => s.range);

  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) =>
      markHabit(habitId, date),

    onMutate: async ({ habitId, date }) => {
      // 1. Get today's date string (must match exactly what useCompletions uses)
      const localToday = new Date().toLocaleDateString('en-CA');
      
      // 2. Construct the EXACT key used in useCompletions
      const key = ["completions", range, localToday];

      // 3. Cancel outgoing fetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: key });

      // 4. Snapshot the previous value
      const previous = queryClient.getQueryData(key);

      // 5. Optimistically update the cache
      queryClient.setQueryData(key, (old: Completion[] = []) => {
        const index = old.findIndex(
          (c) => c.habitId === habitId && c.date === date
        );

        if (index !== -1) {
          // If it exists, toggle the completed state
          const updated = [...old];
          updated[index] = {
            ...updated[index],
            completed: !updated[index].completed,
          };
          return updated;
        }

        // If it doesn't exist in the local cache yet, add it
        return [...old, { habitId, date, completed: true }];
      });

      return { previous, key };
    },

    onError: (_err, variables, context) => {
      if (context?.key) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },

    onSettled: (data, error, variables, context) => {
      if (context?.key) {
        queryClient.invalidateQueries({ queryKey: context.key });
      }
    },
  });
};