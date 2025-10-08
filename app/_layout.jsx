import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message"; // ✅ Toast integrated globally

export default function RootLayout() {
  return (
    <>
      {/* StatusBar */}
      <StatusBar style="light" />

      {/* Stack Navigation */}
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,           // hide header for all screens
          animation: "slide_from_right", // smooth transition
          contentStyle: { backgroundColor: "#0d0d0d" }, // global bg color
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="goals" />
        <Stack.Screen name="goals/create" />
        <Stack.Screen name="goals/edit" /> {/* Added EditGoal screen */}
        <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
      </Stack>

      {/* Toast notification container (global) */}
      <Toast />
    </>
  );
}
