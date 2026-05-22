
import { formatDate } from "@/lib/date";
import { Completion } from "@/lib/types";

type Props = {
  logs: Completion[];
  unit: string;
};

export const LogHistory = ({
  logs,
  unit,
}: Props) => {

  
  const groupedLogs = logs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }

    acc[log.date].push(log);

    return acc;
  }, {} as Record<string, Completion[]>);

  if (logs.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No logs yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {Object.entries(groupedLogs).map(([date, logs]) => (
        <div key={date}>
          
          <div className="border-b border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:border-white/10">
            {formatDisplayDate(date)}
          </div>

          <div>
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border-b border-black/5 bg-white/60 px-3 py-2 text-sm last:border-b-0 dark:border-white/5 dark:bg-zinc-950/30"
              >
                <div className="font-medium">
                  +{log.value} {unit}
                </div>

                <div className="text-xs text-muted-foreground ">
                  {formatLogTime(log.completedAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const displayDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const formatLogTime = (date: string | Date) => {
  return timeFormatter.format(new Date(date));
};

const formatDisplayDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (dateStr === formatDate(today)) return "Today";
  if (dateStr === formatDate(yesterday)) return "Yesterday";

  return displayDateFormatter.format(d);
};
