import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, helper, icon: Icon }: StatCardProps) {
  return (
    <View className="w-[48%] rounded-lg border border-zinc-800 bg-zinc-900/80 p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-extrabold uppercase text-zinc-500">
          {label}
        </Text>
        <Icon color="#34d399" size={18} strokeWidth={2.6} />
      </View>
      <Text className="mt-3 text-3xl font-extrabold text-white">{value}</Text>
      <Text className="mt-2 text-xs font-semibold text-zinc-500">{helper}</Text>
    </View>
  );
}
