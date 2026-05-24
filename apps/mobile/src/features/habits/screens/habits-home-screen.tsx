import {
  formatDate,
  formatDisplayDate,
  getToday,
  type Habit,
  type HabitLifecycle,
  type HabitStatus,
} from "@habitoo/core";
import {
  GraduationCap,
  Layers3,
  Pencil,
  SlidersHorizontal,
} from "lucide-react-native";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DateRail } from "../components/date-rail";
import { HabitFormModal } from "../components/habit-form-modal";
import { HabitSection } from "../components/habit-section";
import { ModeRail } from "../components/mode-rail";
import { useCompleteHabit } from "../hooks/mutations/use-complete-habit";
import { useSetHabitLifecycle } from "../hooks/mutations/use-set-habit-lifecycle";
import { useSetHabitStatus } from "../hooks/mutations/use-set-habit-status";
import { useHabitsListData } from "../hooks/queries/use-habits-list-data";
import { getHabitModeTitle, groupHabits, type HabitMode } from "../utils/group-habits";

function getTitleForDate(date: string) {
  const today = getToday();

  if (date === today) return "Today";
  if (date > today) return "Tomorrow";

  return formatDisplayDate(date);
}

function HeaderActions() {
  return (
    <View className="flex-row gap-4">
      <Pressable
        accessibilityRole="button"
        className="h-[40px] w-[40px] items-center justify-center rounded-full bg-zinc-800"
      >
        <GraduationCap color="white" />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="h-[40px] w-[40px] items-center justify-center rounded-full bg-zinc-800"
      >
        <SlidersHorizontal color="white" />
      </Pressable>
    </View>
  );
}

function EmptyState({ onAddHabit }: { onAddHabit: () => void }) {
  return (
    <View className="items-center px-8 py-20">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-zinc-900">
        <Layers3 color="#71717a" size={30} />
      </View>
      <Text className="mt-5 text-center text-xl font-extrabold text-white">
        No habits yet
      </Text>
      <Text className="mt-2 text-center text-base leading-6 text-zinc-500">
        Start with one small habit you can repeat daily.
      </Text>
      <Pressable
        accessibilityRole="button"
        className="mt-6 rounded-full bg-emerald-500 px-6 py-3"
        onPress={onAddHabit}
      >
        <Text className="font-extrabold text-white">Create habit</Text>
      </Pressable>
    </View>
  );
}

export function HabitsHomeScreen() {
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));
  const [mode, setMode] = useState<HabitMode>("active");
  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const {
    habits,
    completions,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useHabitsListData(selectedDate);

  const addLog = useCompleteHabit(selectedDate);
  const setHabitStatus = useSetHabitStatus(selectedDate);
  const setHabitLifecycle = useSetHabitLifecycle();

  const groups = useMemo(
    () => groupHabits(habits, selectedDate, completions, mode),
    [habits, completions, mode, selectedDate]
  );

  const pendingHabitId =
    addLog.variables?.habit.id ?? setHabitStatus.variables?.habitId;

  const handleSetStatus = (habit: Habit, status: HabitStatus) => {
    setHabitStatus.mutate({
      habitId: habit.id,
      date: selectedDate,
      status,
    });
  };

  const handleSetLifecycle = (habit: Habit, lifecycle: HabitLifecycle) => {
    const labels: Record<HabitLifecycle, string> = {
      active: "Habit restored",
      completed: "Habit ended",
      archived: "Habit archived",
    };

    setHabitLifecycle.mutate(
      { habitId: habit.id, lifecycle },
      {
        onSuccess: () => {
          Alert.alert("Updated", labels[lifecycle]);
        },
        onError: () => {
          Alert.alert("Error", "Could not update habit.");
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950 " edges={["top"]}>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-8"
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              tintColor="#fb923c"
              onRefresh={refetch}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View className="px-7 pt-5">
            <View className="flex-row items-start justify-between gap-5">
              <View className="min-w-0 flex-1">
                <Text className="text-[16px] font-extrabold uppercase tracking-normal text-zinc-500">
                  {getTitleForDate(selectedDate)}
                </Text>
                <View className="flex-row items-center gap-3">
                  <Text
                    className="max-w-[250px] text-[30px] font-extrabold leading-[44px] text-white"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {getHabitModeTitle(mode)}
                  </Text>
                  <Pencil fill="white" stroke="black" />
                </View>
              </View>

              <HeaderActions />
            </View>
          </View>

          <ModeRail value={mode} onChange={setMode} />

          {isLoading ? (
            <View className="items-center py-20">
              <ActivityIndicator color="#fb923c" size="large" />
              <Text className="mt-4 text-base font-semibold text-zinc-500">
                Loading habits
              </Text>
            </View>
          ) : error ? (
            <View className="items-center px-8 py-20">
              <Text className="text-center text-xl font-extrabold text-white">
                Could not load habits
              </Text>
              <Text className="mt-2 text-center text-base leading-6 text-zinc-500">
                Pull to refresh or check that your web API is deployed.
              </Text>
              <Pressable
                accessibilityRole="button"
                className="mt-6 rounded-full bg-zinc-800 px-6 py-3"
                onPress={refetch}
              >
                <Text className="font-extrabold text-white">Try again</Text>
              </Pressable>
            </View>
          ) : groups.length === 0 ? (
            <EmptyState onAddHabit={() => setAddHabitOpen(true)} />
          ) : (
            <View>
              {groups.map((group) => (
                <HabitSection
                  key={group.key}
                  kind={group.kind}
                  title={group.title}
                  habits={group.habits}
                  completions={completions}
                  selectedDate={selectedDate}
                  pendingHabitId={pendingHabitId}
                  isLogging={addLog.isPending || setHabitStatus.isPending}
                  onAddLog={(habit, value) => {
                    if (value <= 0) return;
                    addLog.mutate({ habit, date: selectedDate, value });
                  }}
                  onEdit={setEditingHabit}
                  onOpenDetails={(item) => router.push(`/habits/${item.id}`)}
                  onSetLifecycle={handleSetLifecycle}
                  onSetStatus={handleSetStatus}
                />
              ))}
            </View>
          )}
        </ScrollView>

        <DateRail
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onAddHabit={() => setAddHabitOpen(true)}
        />

        <HabitFormModal
          open={addHabitOpen}
          selectedDate={selectedDate}
          onOpenChange={setAddHabitOpen}
        />

        <HabitFormModal
          habit={editingHabit}
          open={!!editingHabit}
          selectedDate={selectedDate}
          onOpenChange={(open) => {
            if (!open) setEditingHabit(null);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
