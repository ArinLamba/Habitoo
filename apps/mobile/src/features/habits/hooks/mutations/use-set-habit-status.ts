import { useAuth } from "@clerk/expo";
import { type Completion, type HabitStatus } from "@habitoo/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../../data/query-keys";
import { habitsApi } from "../../api/habits-api";

type SetHabitStatusInput = {
  habitId: string;
  date: string;
  status: HabitStatus;
};

export function useSetHabitStatus(selectedDate: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, date, status }: SetHabitStatusInput) =>
      habitsApi.setHabitStatus(habitId, date, status, await getToken()),
    onMutate: async ({ habitId, date, status }) => {
      const overviewQueryKey = queryKeys.completions("all", selectedDate);
      const detailQueryKey = queryKeys.habitCompletions(habitId, "all");

      await Promise.all([
        queryClient.cancelQueries({ queryKey: overviewQueryKey }),
        queryClient.cancelQueries({ queryKey: detailQueryKey }),
      ]);

      const previousOverview =
        queryClient.getQueryData<Completion[]>(overviewQueryKey) ?? [];
      const previousDetail =
        queryClient.getQueryData<Completion[]>(detailQueryKey) ?? [];

      const removeDay = (items: Completion[]) =>
        items.filter(
          (completion) =>
            !(completion.habitId === habitId && completion.date === date)
        );

      const withoutDay = removeDay(previousOverview);
      const withoutDetailDay = removeDay(previousDetail);

      if (status === null) {
        queryClient.setQueryData<Completion[]>(overviewQueryKey, withoutDay);
        queryClient.setQueryData<Completion[]>(detailQueryKey, withoutDetailDay);
        return {
          previousOverview,
          previousDetail,
          overviewQueryKey,
          detailQueryKey,
        };
      }

      const optimisticStatus: Completion = {
        id: `optimistic-${habitId}-${date}-${Date.now()}`,
        habitId,
        date,
        status,
        value: null,
        note: null,
        completedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Completion[]>(overviewQueryKey, [
        ...withoutDay,
        optimisticStatus,
      ]);

      queryClient.setQueryData<Completion[]>(detailQueryKey, [
        ...withoutDetailDay,
        optimisticStatus,
      ]);

      return {
        previousOverview,
        previousDetail,
        overviewQueryKey,
        detailQueryKey,
      };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(context.overviewQueryKey, context.previousOverview);
        queryClient.setQueryData(context.detailQueryKey, context.previousDetail);
      }
    },
    onSettled: (_data, _error, { habitId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.completions("all", selectedDate),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.habitCompletions(habitId, "all"),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}
