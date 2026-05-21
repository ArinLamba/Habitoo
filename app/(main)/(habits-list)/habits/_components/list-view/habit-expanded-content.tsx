import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Habit } from "@/lib/types";

import { Flame, Plus } from "lucide-react";
import { HabitActions } from "../habit-actions";

type HabitExpandedContentProps = {
  value: number;
  setValue: (value: number) => void;
  currentStreak: number;
  longestStreak: number;
  addValue: (value: number) => void;
  habit: Habit;
  disabled: boolean;
};

export const HabitExpandedContent = ({
  value,
  setValue,
  currentStreak,
  longestStreak,
  addValue,
  habit,
  disabled
}: HabitExpandedContentProps) => {
  return (
    <div className="ml-[70px] mt-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-3 rounded-md border border-black/10 bg-muted/40 px-3 py-2 text-xs dark:border-white/10">
        <span className="flex items-center gap-1 font-semibold text-amber-600">
          <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          {currentStreak}
        </span>

        <span className="text-muted-foreground">
          Best {longestStreak}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          value={value}
          onClick={(e) => e.stopPropagation()}
          onChange={(event) => {
            setValue(Math.max(0, Number(event.target.value)));
          }}
          disabled={disabled}
          className="h-8 w-20"
        />

        <Button
          type="button"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            addValue(value);
          }}
          disabled={disabled}
        >
          <Plus className="h-3.5 w-3.5" />
          Log
        </Button>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <HabitActions habit={habit} />
      </div>
    </div>
  );
};