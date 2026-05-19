import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addHabitLog } from "@/server/actions/add-log";

export const useAddLog = () => {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: addHabitLog,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["completions"],
      });

    },
  });
};