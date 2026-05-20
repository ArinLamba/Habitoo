

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
    <div className="flex overflow-hidden rounded-md border border-black/10 bg-white/95 shadow-sm dark:border-white/10 dark:bg-zinc-950/90">
      <AddHabitInput />

      <div className="flex text-xs">
        <button
          disabled={isDisabled}
          onClick={() => handleClick(HABIT_STATUS.COMPLETED)}
          className={`flex h-9 items-center gap-2 border-l border-black/10 px-4 transition-colors dark:border-white/10 ${
            isDisabled ? "cursor-not-allowed text-muted-foreground/50" : "font-semibold text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
          }`}
        >
          <Check size={18} />
          <p>Complete</p>
        </button>


        <button
          disabled={isDisabled}
          onClick={() => handleClick(HABIT_STATUS.SKIPPED)}
          className={`flex h-9 items-center gap-2 border-l border-black/10 px-4 transition-colors dark:border-white/10 ${
            isDisabled ? "cursor-not-allowed text-muted-foreground/50" : "font-semibold text-muted-foreground hover:bg-zinc-100 hover:text-foreground dark:hover:bg-white/5"
          }`}
        >
          <ArrowRight size={18} />
          <p>Skip</p>
        </button>

        <button
          disabled={isDisabled}
          onClick={() => handleClick(HABIT_STATUS.FAILED)}
          className={`flex h-9 items-center gap-2 border-l border-black/10 px-4 transition-colors dark:border-white/10 ${
            isDisabled ? "cursor-not-allowed text-muted-foreground/50" : "font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-300"
          }`}
        >
          <X size={18} />
          <p>Fail</p>
        </button>
      </div>
    </div>
  );
};
