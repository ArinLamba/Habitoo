
import { formatDate } from "@/lib/date";
import { Completion } from "@/lib/types";

export const WeeklyTrend = ({ completions }: {
  completions: Completion[];
}) => {

  const doneMap = new Map();

  completions.forEach(c => {
    if (!c.completed) return;
    doneMap.set(c.date, (doneMap.get(c.date) || 0) + 1);
  });

  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));

    const key = formatDate(d);

    return {
      day: d.toLocaleDateString("default", { weekday: "short" }),
      count: doneMap.get(key) || 0,
    };
  });

  return (
    <div className="p-4 rounded-lg border bg-white shadow-md dark:bg-zinc-900">
      <p className="text-sm text-muted-foreground mb-3">📈 Weekly Trend</p>

      <div className="flex items-end gap-4 h-32">
        {last7.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-6 bg-purple-500 rounded"
              style={{ height: `${d.count * 10 + 10}px` }}
            />
            <span className="text-xs text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
