import { useClerk } from "@clerk/expo";
import { getLast14Days, getToday } from "@habitoo/core";
import { Pressable, Text, View } from "react-native";

import { Screen } from "../../../shared/ui/screen";
import { HabitSummaryCard } from "../components/habit-summary-card";
import { useHabitsOverview } from "../hooks/queries/use-habits-overview";
import { Loading } from "../../../components/loading";

export function HabitsHomeScreen() {
  const { signOut } = useClerk();
  const { data: habits, isLoading, error } = useHabitsOverview();
  const recentDays = getLast14Days().slice(-7);
  const today = getToday();
  
  if (isLoading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }
  
  if (error) {
    return (
      <Screen>
        <Text className="felx-1 text-red-400">Failed to load habits</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-row items-start justify-between gap-4">
        <View className="gap-2">
          <Text className="text-xs font-bold uppercase tracking-normal text-orange-400">
            Habitoo
          </Text>
          <Text className="text-[34px] font-extrabold leading-[40px] text-white">
            Today
          </Text>
          <Text className="text-sm text-zinc-400">{today}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          className="rounded-lg border border-zinc-800 px-3 py-2"
          onPress={() => signOut()}
        >
          <Text className="text-xs font-bold text-zinc-300">Sign out</Text>
        </Pressable>
      </View>

      <View className="mt-7 flex-row gap-2">
        {recentDays.map((day) => (
          <View
            key={day.date}
            className="h-14 flex-1 items-center justify-center rounded-lg bg-zinc-900"
          >
            <Text className="text-xs font-semibold text-zinc-500">
              {day.shortDay}
            </Text>
            <Text className="mt-1 text-sm font-bold text-white">
              {day.date.slice(-2)}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-7 gap-3">
        {habits?.length ? habits.map((habit) => (
          <HabitSummaryCard key={habit.id} habit={habit} />
        )) : (
          <Text className="text-sm text-zinc-400">
            No habits yet. Create your first habit on web for now.
          </Text>
        )}
      </View>
    </Screen>
  );
}
