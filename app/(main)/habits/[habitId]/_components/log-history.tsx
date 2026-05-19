
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
          
          <div className="sticky top- bg-muted-foreground/5 px-4 py-2 text-xs text-muted-foreground font-normal border-b">
            {formatDisplayDate(date)}
          </div>

          <div>
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between px-4 py-2 text-sm"
              >
                <div>
                  +{log.value} {unit}
                </div>

                <div className="text-xs text-muted-foreground">
                  {new Date(log.completedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const formatDisplayDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formattedToday = formatDate(today);
  const formattedYesterday = formatDate(yesterday);

  if (dateStr === formattedToday) {
    return "Today";
  }

  if (dateStr === formattedYesterday) {
    return "Yesterday";
  }

  return d.toLocaleDateString("default", {
    day: "numeric",
    month: "short",
  });
};