import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { APP_ACCENT_COLOR } from "../src/shared/constants";

export default function SsoCallbackRoute() {
  const { isLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-950">
        <ActivityIndicator color={APP_ACCENT_COLOR} />
      </View>
    );
  }

  return <Redirect href={isSignedIn ? "/habits" : "/"} />;
}
