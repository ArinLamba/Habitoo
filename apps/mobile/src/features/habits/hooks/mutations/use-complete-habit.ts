import { useAuth } from "@clerk/expo";
import { type Completion, type Habit } from "@habitoo/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../../data/query-keys";
import { habitsApi } from "../../api/habits-api";

type CompleteHabitInput = {
  habit: Habit;
  date: string;
  value: number;
};

export function useCompleteHabit(selectedDate: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habit, date, value }: CompleteHabitInput) => {
      return habitsApi.addHabitLog(
        habit.id,
        {
          date,
          value,
        },
        await getToken()
      );
    },
    onMutate: async ({ habit, date, value }) => {
      const overviewQueryKey = queryKeys.completions("all", selectedDate);
      const detailQueryKey = queryKeys.habitCompletions(habit.id, "all");
      const logsQueryKey = queryKeys.habitLogs(habit.id);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: overviewQueryKey }),
        queryClient.cancelQueries({ queryKey: detailQueryKey }),
        queryClient.cancelQueries({ queryKey: logsQueryKey }),
      ]);

      const previousOverview =
        queryClient.getQueryData<Completion[]>(overviewQueryKey) ?? [];
      const previousDetail =
        queryClient.getQueryData<Completion[]>(detailQueryKey) ?? [];
      const previousLogs =
        queryClient.getQueryData<Completion[]>(logsQueryKey) ?? [];

      const optimisticLog: Completion = {
        id: `optimistic-${habit.id}-${date}-${Date.now()}`,
        habitId: habit.id,
        date,
        status: "completed",
        value,
        completedAt: new Date().toISOString(),
      };

      const removeManualStatus = (items: Completion[]) =>
        items.filter(
          (completion) =>
            !(
              completion.habitId === habit.id &&
              completion.date === date &&
              (completion.value === null || completion.value === undefined)
            )
        );

      const withoutManualStatus = removeManualStatus(previousOverview);

      queryClient.setQueryData<Completion[]>(overviewQueryKey, [
        ...withoutManualStatus,
        optimisticLog,
      ]);

      queryClient.setQueryData<Completion[]>(detailQueryKey, [
        ...removeManualStatus(previousDetail),
        optimisticLog,
      ]);

      queryClient.setQueryData<Completion[]>(logsQueryKey, [
        optimisticLog,
        ...previousLogs,
      ]);

      return {
        previousOverview,
        previousDetail,
        previousLogs,
        overviewQueryKey,
        detailQueryKey,
        logsQueryKey,
      };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(context.overviewQueryKey, context.previousOverview);
        queryClient.setQueryData(context.detailQueryKey, context.previousDetail);
        queryClient.setQueryData(context.logsQueryKey, context.previousLogs);
      }
    },
    onSettled: (_data, _error, { habit }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
      queryClient.invalidateQueries({
        queryKey: queryKeys.completions("all", selectedDate),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.habitCompletions(habit.id, "all"),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.habitLogs(habit.id),
      });
    },
  });
}
