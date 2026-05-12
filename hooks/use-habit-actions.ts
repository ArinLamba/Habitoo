import { useSetHabitStatus } from "@/hooks/mutations/use-set-habit-status";
import { HabitStatus } from "@/lib/types";

type Params = {
  completionMap?: Map<string, HabitStatus>;
};

export const useHabitActions = ({ completionMap }: Params) => {
  const { mutate } = useSetHabitStatus();

  const toggle = (
    habitId: string,
    date: string,
    newStatus: HabitStatus
  ) => {
    const currentStatus =
      completionMap?.get(`${habitId}-${date}`) ?? null;

    const finalStatus =
      currentStatus === newStatus ? null : newStatus;

    mutate({
      habitId,
      date,
      status: finalStatus,
    });
  };

  const clear = (habitId: string, date: string) => {
    mutate({
      habitId,
      date,
      status: null,
    });
  };

  return {
    toggle,
    clear,
  };
};