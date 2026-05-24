import { BarChart3 } from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HabitPerformance } from "../components/habit-performance";
import { HabitSignals } from "../components/habit-signals";
import { MonthlyTrend } from "../components/monthly-trend";
import { PatternRead } from "../components/pattern-read";
import { StatsOverview } from "../components/stats-overview";
import { useAnalyticsData } from "../hooks/use-analytics-data";

export function AnalyticsScreen() {
  const { habits, completions, isLoading, isFetching, error, refetch } =
    useAnalyticsData();

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8 pt-5"
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            tintColor="#fb923c"
            onRefresh={refetch}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
          <View className="flex-row items-center gap-2">
            <BarChart3 color="#34d399" size={18} strokeWidth={2.7} />
            <Text className="text-xs font-extrabold uppercase text-zinc-500">
              Analytics
            </Text>
          </View>
          <Text className="mt-2 text-3xl font-extrabold text-white">
            Your habit rhythm
          </Text>
          <Text className="mt-2 text-sm font-semibold leading-6 text-zinc-500">
            A quiet view of what you logged, where momentum is building, and which habits deserve attention.
          </Text>
        </View>

        {isLoading ? (
          <View className="items-center py-20">
            <ActivityIndicator color="#fb923c" size="large" />
            <Text className="mt-4 text-base font-semibold text-zinc-500">
              Loading analytics
            </Text>
          </View>
        ) : error ? (
          <View className="items-center px-4 py-20">
            <Text className="text-center text-xl font-extrabold text-white">
              Could not load analytics
            </Text>
            <Pressable
              accessibilityRole="button"
              className="mt-6 rounded-full bg-zinc-800 px-6 py-3"
              onPress={refetch}
            >
              <Text className="font-extrabold text-white">Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <StatsOverview habits={habits} completions={completions} />
            <MonthlyTrend habits={habits} completions={completions} />
            <HabitSignals habits={habits} completions={completions} />
            <PatternRead completions={completions} />
            <HabitPerformance habits={habits} completions={completions} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
