import { useAuth } from "@clerk/expo";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Text, View } from "react-native";

import { AuthLandingScreen } from "../features/auth";
import { HabitsHomeScreen } from "../features/habits/screens/habits-home-screen";
import { AppProviders } from "./providers";

function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-950 px-5">
        <ActivityIndicator color="#fb923c" />
        <Text className="mt-4 text-sm font-semibold text-zinc-400">
          Loading Habitoo
        </Text>
      </View>
    );
  }

  if (!isSignedIn) {
    return <AuthLandingScreen />;
  }

  return <HabitsHomeScreen />;
}

export function AppShell() {
  return (
    <AppProviders>
      <AuthGate />
      <StatusBar style="light" />
    </AppProviders>
  );
}
