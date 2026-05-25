import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

import { AuthLandingScreen } from "../src/features/auth";
import { APP_ACCENT_COLOR } from "../src/shared/constants";

function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-zinc-950 px-5">
      <ActivityIndicator color={APP_ACCENT_COLOR} />
      <Text className="mt-4 text-sm font-semibold text-zinc-400">
        Loading Habitoo
      </Text>
    </View>
  );
}

export default function IndexRoute() {
  const { isLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (isSignedIn) {
    return <Redirect href="/habits" />;
  }

  return <AuthLandingScreen />;
}
