import { buildHabitStats, formatDate, getToday } from "@habitoo/core";
import { router } from "expo-router";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HabitFormModal } from "../components/habit-form-modal";
import { HabitLogModal } from "../components/habit-log-modal";
import { DeleteHabitConfirmModal } from "../components/habit-details/delete-habit-confirm-modal";
import { HabitDetailsHeader } from "../components/habit-details/habit-details-header";
import { HabitDetailsAbout } from "../components/habit-details/habit-details-about";
import type { HabitDetailsPanelTab } from "../components/habit-details/habit-details-panel-tabs";
import type { HeatmapRange } from "../components/habit-details/habit-details-range-select";
import { HabitStatsSummary } from "../components/habit-details/habit-stats-summary";
import { LogHistoryList } from "../components/habit-details/log-history-list";
import { MonthCalendar } from "../components/habit-details/month-calendar";
import { ProgressChart } from "../components/habit-details/progress-chart";
import { StreakCard } from "../components/habit-details/streak-card";
import { StreakTimeline } from "../components/habit-details/streak-timeline";
import { useCompleteHabit } from "../hooks/mutations/use-complete-habit";
import { useDeleteHabit } from "../hooks/mutations/use-delete-habit";
import { useSetHabitStatus } from "../hooks/mutations/use-set-habit-status";
import { useHabitDetailsData } from "../hooks/queries/use-habit-details-data";

type HabitDetailsScreenProps = {
  habitId?: string;
};

export function HabitDetailsScreen({ habitId }: HabitDetailsScreenProps) {
  const today = getToday();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [logDate, setLogDate] = useState(today);
  const [selectedTab, setSelectedTab] = useState<HabitDetailsPanelTab>("Progress");
  const [heatmapRange, setHeatmapRange] = useState<HeatmapRange>("90");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const {
    habit,
    completions,
    logs,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useHabitDetailsData(habitId);

  const deleteHabit = useDeleteHabit();
  const addLog = useCompleteHabit(today);
  const setStatus = useSetHabitStatus(today);

  const analytics = useMemo(
    () => (habit ? buildHabitStats(habit, completions) : null),
    [habit, completions]
  );

  const confirmDelete = () => {
    if (!habit) return;

    setDeleteOpen(true);
  };

  const deleteConfirmed = () => {
    if (!habit) return;

    deleteHabit.mutate(habit.id, {
      onSuccess: () => router.replace("/habits"),
      onError: () => setDeleteOpen(false),
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-zinc-950 px-6">
        <ActivityIndicator color="#fb923c" size="large" />
        <Text className="mt-4 text-base font-semibold text-zinc-500">
          Loading habit stats
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !habit || !analytics) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 px-6">
        <View className="flex-row items-center pt-4">
          <Pressable
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full bg-zinc-900"
            onPress={() => router.back()}
          >
            <ArrowLeft color="#fff" size={20} />
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-xl font-extrabold text-white">
            Could not load habit
          </Text>
          <Pressable
            accessibilityRole="button"
            className="mt-6 rounded-full bg-zinc-800 px-6 py-3"
            onPress={refetch}
          >
            <Text className="font-extrabold text-white">Try again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const color = habit.color || "#34d399";

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top"]}>
      <HabitDetailsHeader
        habit={habit}
        range={heatmapRange}
        onAddLog={() => {
          setLogDate(today);
          setLogOpen(true);
        }}
        onBack={() => router.back()}
        onEdit={() => setEditOpen(true)}
        onRangeChange={setHeatmapRange}
        onSelectTab={setSelectedTab}
        selectedTab={selectedTab}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-4 pb-10 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            tintColor="#fb923c"
            onRefresh={refetch}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === "Progress" ? (
          <>
            <View className="mb-1 flex-row items-center justify-between px-1">
              <Pressable
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-full"
                onPress={() =>
                  setCalendarMonth(
                    (current) =>
                      new Date(current.getFullYear(), current.getMonth() - 1, 1)
                  )
                }
              >
                <ChevronLeft color="#3f3f46" size={24} strokeWidth={3} />
              </Pressable>
              <View className="flex-row items-center gap-1">
                <Text className="text-2xl font-extrabold text-white">
                  {calendarMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <ChevronDown color="#fff" size={20} strokeWidth={3} />
              </View>
              <Pressable
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-full"
                onPress={() =>
                  setCalendarMonth(
                    (current) =>
                      new Date(current.getFullYear(), current.getMonth() + 1, 1)
                  )
                }
              >
                <ChevronRight color="#3f3f46" size={24} strokeWidth={3} />
              </Pressable>
            </View>

            <View className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#141414]">
              <StreakCard analytics={analytics} habit={habit} />
            </View>
            <HabitStatsSummary analytics={analytics} habit={habit} />
              <MonthCalendar
                analytics={analytics}
                anchorMonth={calendarMonth}
                completions={completions}
                habit={habit}
                isSaving={addLog.isPending || setStatus.isPending}
                showHeader={false}
                onMoveMonth={(amount) =>
                  setCalendarMonth(
                    (current) =>
                      new Date(
                        current.getFullYear(),
                        current.getMonth() + amount,
                        1
                      )
                  )
                }
                onAddCalendarLog={(date, value) => {
                  addLog.mutate({ habit, date, value });
                }}
                onFillRemaining={(date, value) => {
                  addLog.mutate({ habit, date, value });
                }}
                onSetStatus={(date, status) => {
                  setStatus.mutate({ habitId: habit.id, date, status });
                }}
              />
            <StreakTimeline
              analytics={analytics}
              color={color}
              frequency={habit.frequency}
            />
            <ProgressChart
              analytics={analytics}
              color={color}
              frequency={habit.frequency}
            />
          </>
        ) : null}

        {selectedTab === "LogHistory" ? (
          <View className="min-h-[420px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
            <LogHistoryList logs={logs} unit={habit.unit || "times"} />
          </View>
        ) : null}
        
        {selectedTab === "Notes" ? (
          <View className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-6">
            <Text className="text-sm font-semibold text-zinc-500">
              Notes will appear here.
            </Text>
          </View>
        ) : null}

        {selectedTab === "About" ? (
          <View className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
            <HabitDetailsAbout
              habit={habit}
              isDeleting={deleteHabit.isPending}
              onDelete={confirmDelete}
            />
          </View>
        ) : null}

      </ScrollView>

      <HabitFormModal
        habit={habit}
        open={editOpen}
        selectedDate={formatDate(new Date())}
        onOpenChange={setEditOpen}
      />

      <HabitLogModal
        habit={habit}
        isSaving={addLog.isPending}
        open={logOpen}
        selectedDate={logDate}
        showDateField
        onClose={() => setLogOpen(false)}
        onSubmit={(value, date) => {
          setLogOpen(false);
          addLog.mutate({ habit, date, value });
        }}
      />

      <DeleteHabitConfirmModal
        habitName={habit.name}
        isDeleting={deleteHabit.isPending}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteConfirmed}
      />
    </SafeAreaView>
  );
}
