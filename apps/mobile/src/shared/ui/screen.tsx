import type { PropsWithChildren } from "react";
import { View } from "react-native";

export function Screen({ children }: PropsWithChildren) {
  return (
    <View className="flex-1 bg-zinc-950 px-5 pb-8 pt-16">
      {children}
    </View>
  );
}
