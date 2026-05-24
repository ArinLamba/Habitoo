import { formatDisplayDate, type Completion } from "@habitoo/core";
import { ScrollView, Text, View } from "react-native";

type LogHistoryListProps = {
  logs: Completion[];
  unit: string;
};

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const formatLogTime = (date?: string | Date) => {
  if (!date) return "";
  return timeFormatter.format(new Date(date));
};

export function LogHistoryList({ logs, unit }: LogHistoryListProps) {
  const groupedLogs = logs.reduce<Record<string, Completion[]>>((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {});

  if (logs.length === 0) {
    return (
      <Text className="px-4 py-6 text-sm font-semibold text-zinc-500">
        No logs yet.
      </Text>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {Object.entries(groupedLogs).map(([date, dateLogs]) => (
        <View key={date}>
          <Text className="border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-xs font-extrabold uppercase text-zinc-500">
            {formatDisplayDate(date)}
          </Text>
          {dateLogs.map((log, index) => (
            <View
              className="flex-row items-center justify-between border-b border-zinc-800/80 bg-zinc-950/40 px-4 py-3"
              key={log.id ?? `${date}-${index}`}
            >
              <Text className="text-sm font-bold text-white">
                +{log.value ?? 1} {unit}
              </Text>
              <Text className="text-xs font-semibold text-zinc-500">
                {formatLogTime(log.completedAt)}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
