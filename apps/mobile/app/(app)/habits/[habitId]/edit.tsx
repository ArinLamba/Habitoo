import { useLocalSearchParams } from "expo-router";

import { HabitFormScreen } from "../../../../src/features/habits/screens/habit-form-screen";

export default function EditHabitRoute() {
  const { habitId } = useLocalSearchParams<{ habitId: string }>();

  return <HabitFormScreen habitId={habitId} />;
}
