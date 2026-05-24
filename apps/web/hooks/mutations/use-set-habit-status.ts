import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setHabit } from "@/server/actions/set-habit";
import { Completion, HabitStatus } from "@/lib/types";
import { useRouter } from "next/navigation";


// /hooks/mutations/use-toggle-completion.ts

export const useSetHabitStatus = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ habitId, date, status }: { habitId: string; date: string, status: HabitStatus }) =>
      setHabit(habitId, date, status),

    onMutate: async ({ habitId, date, status }) => {
      await queryClient.cancelQueries({ queryKey: ["completions"] });

      const previous = queryClient.getQueriesData<Completion[]>({
        queryKey: ["completions"],
      });

      queryClient.setQueriesData<Completion[]>(
        { queryKey: ["completions"] },
        (old = []) => {
          const withoutDay = old.filter(
            (c) => !(c.habitId === habitId && c.date === date)
          );

          if (status === null) {
            return withoutDay;
          }

          return [
            ...withoutDay,
            {
              id: `optimistic-${habitId}-${date}-${Date.now()}`,
              habitId,
              date,
              status,
              value: null,
              note: null,
              userId: "optimistic",
              completedAt: new Date(),
            } as Completion,
          ];
        }
      );

      return { previous };
    },

    onError: (_err, variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["completions"],
        refetchType: "none",
      });
      router.refresh();
    },
  });
};
