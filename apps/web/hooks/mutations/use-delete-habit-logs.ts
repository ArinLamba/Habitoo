"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { Completion } from "@/lib/types";

type DeleteHabitLogsInput = {
  habitId: string;
  logIds: string[];
};

const deleteHabitLogs = async ({ habitId, logIds }: DeleteHabitLogsInput) => {
  const response = await fetch(`/api/habits/${habitId}/logs`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ logIds }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete logs");
  }

  return response.json() as Promise<{ deletedLogIds: string[] }>;
};

const withoutDeletedLogs = (logIds: string[]) => (items: Completion[] = []) =>
  items.filter((completion) => !logIds.includes(completion.id));

export const useDeleteHabitLogs = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteHabitLogs,
    onMutate: async ({ logIds }) => {
      await queryClient.cancelQueries({ queryKey: ["completions"] });

      const previousCompletionQueries =
        queryClient.getQueriesData<Completion[]>({
          queryKey: ["completions"],
        });

      queryClient.setQueriesData<Completion[]>(
        { queryKey: ["completions"] },
        withoutDeletedLogs(logIds)
      );

      return { previousCompletionQueries };
    },
    onError: (_error, _variables, context) => {
      context?.previousCompletionQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["completions"] });
      router.refresh();
    },
  });
};
