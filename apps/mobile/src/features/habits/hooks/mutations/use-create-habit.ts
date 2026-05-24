import { useAuth } from "@clerk/expo";
import type { HabitFormValues } from "@habitoo/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../../data/query-keys";
import { habitsApi } from "../../api/habits-api";

export function useCreateHabit() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: HabitFormValues) =>
      habitsApi.createHabit(values, await getToken()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.habits });
      await queryClient.invalidateQueries({ queryKey: ["completions"] });
    },
  });
}
