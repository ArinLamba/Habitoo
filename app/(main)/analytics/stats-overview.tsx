
import { Completion, Habit, HABIT_STATUS } from "@/lib/types";

export const StatsOverview = ({ habits, completions }: {
  habits: Habit[];
  completions: Completion[];
}) => {

  const total = completions.length;
  const done = completions.filter(c => c.status === HABIT_STATUS.COMPLETED).length;

  const rate = total === 0 ? 0 : Math.round((done / total) * 100);

  const totalDays = new Set(
    completions.map(c => c.date)
  ).size;

  return (
    <div className="grid grid-cols-4 gap-4">

      <Card label="Completion Rate" value={`${rate}%`} />
      <Card label="Total Habits" value={`${habits.length}`} />
      <Card label="Total Days" value={`${totalDays}`} />
      <Card label="Total Logs" value={`${total}`} />

    </div>
  );
};


type CardProps = {
  label: string;
  value: string;
};
const Card = ({
  label,
  value,
}: CardProps) => {
  return (
    <div className="border-r border-white/10 px-4 py-3 last:border-r-0">
      <div className="flex items-center gap-1 text-[11px] font-semibold tracking-wide text-zinc-300">
        <span>{label}</span>
      </div>

      <div className="mt-1 flex items-end gap-1">
        <h2 className="text-sm font-bold leading-none text-white">
          {value}
        </h2>
      </div>
    </div>
  );
};