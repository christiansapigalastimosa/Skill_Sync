import { Stack } from "expo-router";

export default function GoalsLayout() {
  return (
    <Stack
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      {/* 🏠 Home Screen */}
      <Stack.Screen name="home" />

      {/* 📋 Goals List */}
      <Stack.Screen name="index" />

      {/* ➕ Create Goal */}
      <Stack.Screen name="create" />

      {/* ✏️ Optional future screens */}
      {/* <Stack.Screen name="details" /> */}
      {/* <Stack.Screen name="edit" /> */}
    </Stack>
  );
}
