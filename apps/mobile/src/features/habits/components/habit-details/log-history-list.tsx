import { formatDisplayDate, type Completion } from "@habitoo/core";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";

import { APP_ACCENT_COLOR } from "../../../../shared/constants";

type LogHistoryListProps = {
  logs: Completion[];
  unit: string;
  isDeleting?: boolean;
  onDeleteLogs?: (logIds: string[]) => void;
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

export function LogHistoryList({
  logs,
  unit,
  isDeleting = false,
  onDeleteLogs,
}: LogHistoryListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectionMode = selectedIds.length > 0;

  const groupedLogs = useMemo(
    () =>
      logs.reduce<Record<string, Completion[]>>((acc, log) => {
        if (!acc[log.date]) {
          acc[log.date] = [];
        }
        acc[log.date].push(log);
        return acc;
      }, {}),
    [logs]
  );

  const isSelected = (log: Completion) =>
    !!log.id && selectedIds.includes(log.id);

  const toggleLog = (log: Completion) => {
    if (!log.id || isDeleting) return;

    setSelectedIds((current) =>
      current.includes(log.id!)
        ? current.filter((id) => id !== log.id)
        : [...current, log.id!]
    );
  };

  const confirmDelete = () => {
    if (selectedIds.length === 0 || !onDeleteLogs) return;

    Alert.alert(
      "Delete selected logs?",
      "This progress is irreversible. Deleted log entries cannot be restored.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: `Delete ${selectedIds.length}`,
          style: "destructive",
          onPress: () => {
            onDeleteLogs(selectedIds);
            setSelectedIds([]);
          },
        },
      ]
    );
  };

  if (logs.length === 0) {
    return (
      <Text className="px-4 py-6 text-sm font-semibold text-zinc-500">
        No logs yet.
      </Text>
    );
  }

  return (
    <View className="flex-1">
      {selectionMode ? (
        <View className="flex-row items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
          <Pressable
            accessibilityRole="button"
            disabled={isDeleting}
            onPress={() => setSelectedIds([])}
          >
            <Text className="text-sm font-extrabold text-zinc-400">Cancel</Text>
          </Pressable>
          <Text className="text-sm font-extrabold text-white">
            {selectedIds.length} selected
          </Text>
          <Pressable
            accessibilityRole="button"
            className="min-w-16 items-end"
            disabled={isDeleting}
            onPress={confirmDelete}
          >
            {isDeleting ? (
              <ActivityIndicator color={APP_ACCENT_COLOR} size="small" />
            ) : (
              <Text className="text-sm font-extrabold text-red-300">Delete</Text>
            )}
          </Pressable>
        </View>
      ) : null}

      <View>
        {Object.entries(groupedLogs).map(([date, dateLogs]) => (
          <View key={date}>
            <Text className="border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-xs font-extrabold uppercase text-zinc-500">
              {formatDisplayDate(date)}
            </Text>
            {dateLogs.map((log, index) => (
              <Pressable
                accessibilityRole="button"
                className={`flex-row items-center justify-between border-b border-zinc-800/80 px-4 py-3 ${
                  isSelected(log) ? "bg-blue-500/10" : "bg-zinc-950/40"
                }`}
                key={log.id ?? `${date}-${index}`}
                onLongPress={() => toggleLog(log)}
                onPress={() => toggleLog(log)}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-5 w-5 items-center justify-center rounded-full border"
                    style={{
                      backgroundColor: isSelected(log)
                        ? APP_ACCENT_COLOR
                        : "transparent",
                      borderColor: isSelected(log)
                        ? APP_ACCENT_COLOR
                        : "#52525b",
                    }}
                  >
                    {isSelected(log) ? (
                      <View className="h-2 w-2 rounded-full bg-white" />
                    ) : null}
                  </View>
                  <Text className="text-sm font-bold text-white">
                    +{log.value ?? 1} {unit}
                  </Text>
                </View>
                <Text className="text-xs font-semibold text-zinc-500">
                  {formatLogTime(log.completedAt)}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
