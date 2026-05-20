

import { useHabitActions } from "@/hooks/use-habit-actions";
import { HABIT_STATUS, HabitStatus } from "@/lib/types";
import { useSelectedCellStore } from "@/store/use-selected-cell-store";
import { ArrowRight, Check, X } from "lucide-react";
import { AddHabitInput } from "./add-habit-input";

type Props = {
  statusMap: Map<string, HabitStatus>;
};
export const BottomActionBar = ({ statusMap }: Props) => {
  const { selectedCell } = useSelectedCellStore();
  const habitId = selectedCell?.habitId;
  const date = selectedCell?.date;
  const { toggle } = useHabitActions({ statusMap });


  const isDisabled = !habitId || !date;

  const handleClick = (newStatus: HabitStatus) => {
    if (isDisabled) return;

    toggle(habitId, date, newStatus);
  };

  return (
    <div className="flex rounded-0 border border-t-0 dark:border-white/10 border-black/10  dark:bg-zinc-900 bg-white">
      <AddHabitInput />

      <div className="flex  text-xs bg-amer-800">
        <button
          disabled={isDisabled}
          onClick={() => handleClick(HABIT_STATUS.COMPLETED)}
          className={`flex items-center gap-2 h-7 px-4 py-4.5 border-l border-r ${
            isDisabled ? "text-gray-500 cursor-not-allowed" : "dark:text-indigo-400 text-blue-700 font-semibold"
          }`}
        >
          <Check size={18} />
          <p>Complete</p>
        </button>


        <button
          disabled={isDisabled}
          onClick={() => handleClick(HABIT_STATUS.SKIPPED)}
          className={`flex items-center gap-3 h-7 px-4 py-4.5  ${
            isDisabled ? "text-gray-500 cursor-not-allowed" : "dark:text-indigo-400 text-blue-700 font-semibold"
          }`}
        >
          <ArrowRight size={18} />
          <p>Skip</p>
        </button>

        <button
          disabled={isDisabled}
          onClick={() => handleClick(HABIT_STATUS.FAILED)}
          className={`flex gap-3 items-center h-7 px-4 py-4.5 border-l ${
            isDisabled ? "text-gray-500 cursor-not-allowed" : "dark:text-indigo-400 text-blue-700 font-semibold"
          }`}
        >
          <X size={18} />
          <p>Fail</p>
        </button>
      </div>
    </div>
  );
};