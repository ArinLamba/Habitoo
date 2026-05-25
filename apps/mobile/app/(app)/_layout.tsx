import { useAuth } from "@clerk/expo";
import { Redirect, Tabs, useSegments } from "expo-router";
import { BarChart3, BookOpenText, ClipboardList, Settings } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-zinc-950 px-5">
      <ActivityIndicator color="#fb923c" />
      <Text className="mt-4 text-sm font-semibold text-zinc-400">
        Loading Habitoo
      </Text>
    </View>
  );
}

export default function AppTabsLayout() {
  const { isLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });
  const segments = useSegments() as string[];
  const insets = useSafeAreaInsets();
  const tabBarBottomPadding = Math.max(insets.bottom, 12);
  const tabBarHeight = 58 + tabBarBottomPadding;
  const isHabitFormRoute =
    segments.includes("habits") &&
    (segments.includes("new") || segments.includes("edit"));

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#34d399",
        tabBarInactiveTintColor: "#71717a",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarStyle: {
          backgroundColor: "#18181b",
          borderTopColor: "#27272a",
          display: isHabitFormRoute ? "none" : "flex",
          height: tabBarHeight,
          paddingBottom: tabBarBottomPadding,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="habits"
        options={{
          title: "Journal",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size} strokeWidth={2.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <BarChart3 color={color} size={size} strokeWidth={2.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, size }) => (
            <BookOpenText color={color} size={size} strokeWidth={2.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} strokeWidth={2.7} />
          ),
        }}
      />
    </Tabs>
  );
}
