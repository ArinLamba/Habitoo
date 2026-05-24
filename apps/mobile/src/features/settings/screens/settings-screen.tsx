import { useClerk } from "@clerk/expo";
import { LogOut, Settings } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SettingsScreen() {
  const { signOut } = useClerk();

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top"]}>
      <View className="flex-1 px-5 pt-5">
        <View className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
          <View className="flex-row items-center gap-2">
            <Settings color="#34d399" size={18} strokeWidth={2.7} />
            <Text className="text-xs font-extrabold uppercase text-zinc-500">
              Settings
            </Text>
          </View>
          <Text className="mt-2 text-3xl font-extrabold text-white">
            Account
          </Text>
          <Text className="mt-2 text-sm font-semibold leading-6 text-zinc-500">
            Manage your session and app preferences.
          </Text>
        </View>

        <View className="mt-5 rounded-lg border border-zinc-800 bg-zinc-900/80">
          <Pressable
            accessibilityRole="button"
            className="flex-row items-center justify-between px-5 py-4"
            onPress={() => signOut()}
          >
            <View>
              <Text className="text-base font-extrabold text-white">Sign out</Text>
              <Text className="mt-1 text-sm font-semibold text-zinc-500">
                Leave this device session.
              </Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
              <LogOut color="#f87171" size={18} strokeWidth={2.7} />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
