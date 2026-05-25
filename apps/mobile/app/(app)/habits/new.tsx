import { useLocalSearchParams } from "expo-router";

import { HabitFormScreen } from "../../../src/features/habits/screens/habit-form-screen";

export default function NewHabitRoute() {
  const { selectedDate } = useLocalSearchParams<{ selectedDate?: string }>();

  return <HabitFormScreen selectedDate={selectedDate} />;
}
