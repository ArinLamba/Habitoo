import type { Completion } from "@habitoo/core";
import { Text, View } from "react-native";

import { LogHistoryList } from "./log-history-list";

type LogHistoryCardProps = {
  logs: Completion[];
  unit: string;
};

/** Inline card wrapper — prefer the right panel on the details screen. */
export function LogHistoryCard({ logs, unit }: LogHistoryCardProps) {
  return (
    <View className="rounded-3xl border border-zinc-800 bg-zinc-900/70">
      <View className="border-b border-zinc-800 px-5 py-4">
        <Text className="text-base font-extrabold text-white">Log history</Text>
      </View>
      <LogHistoryList logs={logs} unit={unit} />
    </View>
  );
}
