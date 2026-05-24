import type { ReactNode } from "react";
import { Text, View } from "react-native";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  trend?: string;
};

export function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <View className="min-h-[112px] flex-1 rounded-2xl border border-zinc-800 bg-[#141414] p-4">
      <View className="flex-row items-center gap-2">
        {icon}
        <Text className="text-[11px] font-extrabold uppercase text-zinc-500">
          {label}
        </Text>
      </View>
      <Text className="mt-3 text-2xl font-extrabold text-white">
        {value}
      </Text>
      <Text
        className={`mt-2 text-sm font-extrabold ${
          trend ? "text-green-500" : "text-zinc-600"
        }`}
      >
        {trend ?? "---"}
      </Text>
    </View>
  );
}
