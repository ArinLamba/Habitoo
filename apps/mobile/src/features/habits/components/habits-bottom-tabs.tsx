import {
  BarChart3,
  Menu,
  Settings,
  Star,
  UsersRound,
} from "lucide-react-native";
import { memo } from "react";
import { Text, View } from "react-native";

const tabs = [
  { label: "Journal", icon: Menu, active: true },
  { label: "Progress", icon: BarChart3, active: false },
  { label: "Friends", icon: UsersRound, active: false },
  { label: "Upgrade", icon: Star, active: false },
  { label: "Settings", icon: Settings, active: false },
] as const;

export const HabitsBottomTabs = memo(function HabitsBottomTabs() {
  return (
    <View className="h-[80px] flex-row items-start justify-around border-t border-zinc-800 bg-zinc-900 px-3 pt-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const color = tab.active ? "#34d399" : "#71717a";

        return (
          <View className="w-16 items-center" key={tab.label}>
            <Icon color={color} size={22} strokeWidth={2.7} />
            <Text
              className={`mt-1 text-xs font-bold ${
                tab.active ? "text-[#34d399]" : "text-zinc-500"
              }`}
            >
              {tab.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
});
