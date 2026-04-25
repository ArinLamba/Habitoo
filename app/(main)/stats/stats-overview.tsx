import { Card } from "@/components/stats-card";
import { Completion, Habit } from "@/lib/types";

export const StatsOverview = ({ habits, completions }: {
  habits: Habit[];
  completions: Completion[];
}) => {

  const total = completions.length;
  const done = completions.filter(c => c.completed).length;

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

