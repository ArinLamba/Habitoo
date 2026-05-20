import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addHabitLog } from "@/server/actions/add-log";
import { Completion } from "@/lib/types";

export const useAddLog = () => {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: addHabitLog,

    onMutate: async ({ habitId, date, value, note }) => {
      await queryClient.cancelQueries({ queryKey: ["completions"] });

      const previous = queryClient.getQueriesData<Completion[]>({
        queryKey: ["completions"],
      });

      queryClient.setQueriesData<Completion[]>(
        { queryKey: ["completions"] },
        (old = []) => {
        const withoutManualStatus = old.filter(
          (completion) =>
            !(
              completion.habitId === habitId &&
              completion.date === date &&
              completion.value === null
            )
        );

        return [
          ...withoutManualStatus,
          {
            id: `optimistic-${habitId}-${date}-${Date.now()}`,
            habitId,
            date,
            value: value.toString(),
            note: note ?? null,
            status: "completed",
            userId: "optimistic",
            completedAt: new Date(),
          } as Completion,
        ];
        }
      );

      return { previous };
    },

    onError: (_error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["completions"],
        refetchType: "none",
      });
    },
  });
};
