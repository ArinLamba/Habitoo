import { useAuth } from "@clerk/expo";
import { AuthView } from "@clerk/expo/native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export function AuthLandingScreen() {
  const { isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/habits");
    }
  }, [isSignedIn, router]);

  return (
    <View className="flex-1 bg-zinc-950">
      <AuthView mode="signInOrUp" />
    </View>
  );
}
