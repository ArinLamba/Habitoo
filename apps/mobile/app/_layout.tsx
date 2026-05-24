import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "../global.css";

import { AppProviders } from "../src/bootstrap/providers";

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" />
    </AppProviders>
  );
}
