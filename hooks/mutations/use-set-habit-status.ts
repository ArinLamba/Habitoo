import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setHabit } from "@/server/actions/set-habit";
import { Completion, HabitStatus } from "@/lib/types";


// /hooks/mutations/use-toggle-completion.ts

export const useSetHabitStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, date, status }: { habitId: string; date: string, status: HabitStatus }) =>
      setHabit(habitId, date, status),

    onMutate: async ({ habitId, date, status }) => {
      // 1. Get today's date string (must match exactly what useCompletions uses)
      const localToday = new Date().toLocaleDateString('en-CA');
      
      // 2. Construct the EXACT key used in useCompletions
      const key = ["completions", localToday];

      // 3. Cancel outgoing fetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: key });

      // 4. Snapshot the previous value
      const previous = queryClient.getQueryData(key);

      // 5. Optimistically update the cache
      queryClient.setQueryData(key,(old: Completion[] = []) => {

        const index = old.findIndex(
          (c) =>
            c.habitId === habitId &&
            c.date === date
        );

        // CLEAR
        if (status === null) {

          return old.filter(
            (c) =>
              !(
                c.habitId === habitId &&
                c.date === date
              )
          );
        }

        // UPDATE
        if (index !== -1) {

          const updated = [...old];

          updated[index] = {
            ...updated[index],
            status,
          };

          return updated;
        }

        // INSERT
        return [...old,{ habitId, date, status },];
      }
    );

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