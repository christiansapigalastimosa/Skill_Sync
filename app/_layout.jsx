import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar"; // ✅ this is required

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" /> {/* or "auto" */}
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="goals" />
        <Stack.Screen name="goals/create" />
        <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
      </Stack>
    </>
  );
}
