import { useAuth } from "@clerk/expo";
import { type Completion } from "@habitoo/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../../data/query-keys";
import { habitsApi } from "../../api/habits-api";

type DeleteHabitLogsInput = {
  habitId: string;
  logIds: string[];
};

const hasLogId = (completion: Completion, logIds: string[]) =>
  !!completion.id && logIds.includes(completion.id);

export function useDeleteHabitLogs() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, logIds }: DeleteHabitLogsInput) =>
      habitsApi.deleteHabitLogs(habitId, logIds, await getToken()),
    onMutate: async ({ habitId, logIds }) => {
      const logsQueryKey = queryKeys.habitLogs(habitId);
      const detailQueryKey = queryKeys.habitCompletions(habitId, "all");

      await Promise.all([
        queryClient.cancelQueries({ queryKey: logsQueryKey }),
        queryClient.cancelQueries({ queryKey: detailQueryKey }),
        queryClient.cancelQueries({ queryKey: ["completions"] }),
      ]);

      const previousLogs =
        queryClient.getQueryData<Completion[]>(logsQueryKey) ?? [];
      const previousDetail =
        queryClient.getQueryData<Completion[]>(detailQueryKey) ?? [];
      const previousCompletionQueries =
        queryClient.getQueriesData<Completion[]>({
          queryKey: ["completions"],
        });

      const withoutDeletedLogs = (items: Completion[] = []) =>
        items.filter((completion) => !hasLogId(completion, logIds));

      queryClient.setQueryData<Completion[]>(
        logsQueryKey,
        withoutDeletedLogs(previousLogs)
      );
      queryClient.setQueryData<Completion[]>(
        detailQueryKey,
        withoutDeletedLogs(previousDetail)
      );
      queryClient.setQueriesData<Completion[]>(
        { queryKey: ["completions"] },
        withoutDeletedLogs
      );

      return {
        logsQueryKey,
        detailQueryKey,
        previousLogs,
        previousDetail,
        previousCompletionQueries,
      };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;

      queryClient.setQueryData(context.logsQueryKey, context.previousLogs);
      queryClient.setQueryData(context.detailQueryKey, context.previousDetail);
      context.previousCompletionQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: (_data, _error, { habitId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
      queryClient.invalidateQueries({ queryKey: ["completions"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.habitCompletions(habitId, "all"),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.habitLogs(habitId),
      });
    },
  });
}
