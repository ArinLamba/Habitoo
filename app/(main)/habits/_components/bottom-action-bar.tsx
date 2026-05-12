
import { Separator } from "@/components/ui/separator";

import { useHabitActions } from "@/hooks/use-habit-actions";
import { HABIT_STATUS, HabitStatus } from "@/lib/types";
import { useSelectedCellStore } from "@/store/use-selected-cell-store";
import { ArrowRight, Check, X } from "lucide-react";
import { AddHabitInput } from "./add-habit-input";

type Props = {
  completionMap: Map<string, HabitStatus>;
};
export const BottomActionBar = ({ completionMap }: Props) => {
  const { selectedCell } = useSelectedCellStore();
  const habitId = selectedCell?.habitId;
  const date = selectedCell?.date;
  const { toggle } = useHabitActions({ completionMap });


  const isDisabled = !habitId || !date;

  const handleClick = (newStatus: HabitStatus) => {
    if (isDisabled) return;

    toggle(habitId, date, newStatus);
  };

  return (
    <div className="sticky bottom-0 z-50 mt-2 flex shrink-0 rounded-md border-t border-zinc-700 bg-zinc-900 p-3 pb-safe">
      <AddHabitInput />

      <Separator orientation="vertical" className="mr-5" />

      <div className="flex lg:space-x-7 space-x-3 text-xs">
        <button
          disabled={isDisabled}
          onClick={() => handleClick(HABIT_STATUS.COMPLETED)}
          className={`flex gap-3 ${
            isDisabled ? "text-gray-500 cursor-not-allowed" : "text-indigo-400"
          }`}
        >
          <Check size={18} />
          <p>Complete</p>
        </button>

        <Separator orientation="vertical" />

        <button
          disabled={isDisabled}
          onClick={() => handleClick(HABIT_STATUS.SKIPPED)}
          className={`flex gap-3 ${
            isDisabled ? "text-gray-500 cursor-not-allowed" : "text-indigo-400"
          }`}
        >
          <ArrowRight size={18} />
          <p>Skip</p>
        </button>

        <Separator orientation="vertical" />

        <button
          disabled={isDisabled}
          onClick={() => handleClick(HABIT_STATUS.FAILED)}
          className={`flex gap-3 ${
            isDisabled ? "text-gray-500 cursor-not-allowed" : "text-indigo-400"
          }`}
        >
          <X size={18} />
          <p>Fail</p>
        </button>
      </div>
    </div>
  );
};