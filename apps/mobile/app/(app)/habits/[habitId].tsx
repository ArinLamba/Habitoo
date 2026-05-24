import { useLocalSearchParams } from "expo-router";

import { HabitDetailsScreen } from "../../../src/features/habits/screens/habit-details-screen";

export default function HabitDetailsRoute() {
  const { habitId } = useLocalSearchParams<{ habitId: string }>();

  return <HabitDetailsScreen habitId={habitId} />;
}
