import { HabitIconName, ICON_MAP } from "@/lib/habit-icons";
import { HabitActions } from "../habit-actions";
import { Habit } from "@/lib/types";

type Props = {
  currentStreak: number;
  longestStreak: number;
  habit: Habit;
}

export const HabitCardHeader = ({ 
  currentStreak,
  longestStreak,
  habit
}: Props) => {

  const IconComponent = (ICON_MAP[habit.icon as HabitIconName] ) || ICON_MAP.QuestionMark;
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-x-2 bg-mber-600">

        <div 
          className="flex items-center justify-center rounded-full h-9 w-9"
          style={{ backgroundColor : `${habit.color}1A`}}
        >
          <IconComponent color={habit.color!}/>
        </div>

        <div>
          <div className="flex  items-center gap-x-2">
            <h1 className="flex-1 text-sm font-semibold tracking-tight">{habit.name}</h1>
            <HabitActions habit={habit} />
          </div>
          <p className="text-xs text-muted-foreground">Habit Goal or Description</p>
        </div>
      </div>

      <div className="bg-amber-500/5 rounded p-2 ">
        <h1 className="text-xs">🔥 Current Streak: {currentStreak} days</h1>
        <p className="text-xs text-muted-foreground">🏆 Longest Streak: {longestStreak} days</p>
      </div>
    </div>
  );
};