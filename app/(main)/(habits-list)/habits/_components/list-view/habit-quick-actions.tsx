import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";



type HabitQuickActionsProps = {
  unit: string;
  isPending: boolean;
  completed: boolean;
  remaining: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addValue: (value: number) => void;
  fillRemaining: () => void;
  disabled: boolean;
};

export const HabitQuickActions = ({
  unit,
  isPending,
  completed,
  remaining,
  open,
  setOpen,
  addValue,
  fillRemaining,
  disabled
}: HabitQuickActionsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="secondary"
        size="sm"
        disabled={disabled || isPending}
        onClick={(e) => {
          e.stopPropagation();
          addValue(1);
        }}
        className="h-8 rounded-full px-3 text-xs"
      >
        + 1 {unit}
      </Button>

      <Button
        variant={completed ? "secondary" : "outline"}
        size="sm"
        disabled={disabled || isPending || remaining <= 0}
        onClick={(e) => {
          e.stopPropagation();
          fillRemaining();
        }}
        className={cn(
          "h-8 rounded-full px-3 text-xs",
          completed && "border-emerald-500/30 text-emerald-600"
        )}
      >
        <Check className="h-3.5 w-3.5" />
        Done
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Toggle habit details"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <ChevronDown
          className={cn(
            "transition-transform",
            open && "rotate-180"
          )}
        />
      </Button>
    </div>
  );
};