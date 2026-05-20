import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { HabitActions } from "./habit-actions";
import { ICON_MAP, HabitIconName } from "@/lib/habit-icons";
import { Habit } from "@/lib/types";

export const LifecycleSection = ({
  title,
  habits,
}: {
  title: string;
  habits: Habit[];
}) => {

  if (!habits.length) return null;
  return (
    <Collapsible className="border-b border-black/10 dark:border-white/10">
      <CollapsibleTrigger className="flex h-9 w-full items-center justify-between px-3 text-xs font-semibold text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200">
        <span>
          {title} ({habits.length})
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {habits.map((habit) => {
          const IconComponent = (ICON_MAP[habit.icon as HabitIconName]);
          return (
            <div
              key={habit.id}
              className="flex h-9 border-t border-black/10 px-3 text-sm dark:border-white/10"
            >
              <Link
                href={`habits/${habit.id}`}
                className="min-w-0 flex items-center gap-2 flex-1 truncate text-zinc-200 hover:text-foreground h-full "
              >
                <IconComponent size={18} style={{color: `${habit.color!}90`}}/>
                {habit.name}
              </Link>
              <HabitActions habit={habit} />
            </div>
          )
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};