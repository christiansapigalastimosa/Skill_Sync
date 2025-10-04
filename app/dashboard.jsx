import { View, Text, Pressable } from "react-native";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/"); // back to login
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d0d0d" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, color: "#00fff7", fontWeight: "bold" }}>
        Welcome, {auth.currentUser?.displayName || auth.currentUser?.email}!
      </Text>

      <Pressable
        style={{
          padding: 15,
          backgroundColor: "#00fff7",
          borderRadius: 12,
          marginBottom: 15,
          width: 200,
          alignItems: "center",
        }}
        onPress={() => router.push("/goals")}
      >
        <Text style={{ fontWeight: "bold", color: "#000" }}>📌 My Goals</Text>
      </Pressable>

      <Pressable
        style={{
          padding: 15,
          backgroundColor: "#00fff7",
          borderRadius: 12,
          marginBottom: 15,
          width: 200,
          alignItems: "center",
        }}
        onPress={() => router.push("/goals/create")}
      >
        <Text style={{ fontWeight: "bold", color: "#000" }}>➕ Create Goal</Text>
      </Pressable>

      <Pressable
        style={{
          padding: 15,
          backgroundColor: "#ff004c",
          borderRadius: 12,
          width: 200,
          alignItems: "center",
        }}
        onPress={handleLogout}
      >
        <Text style={{ fontWeight: "bold", color: "#fff" }}>🚪 Logout</Text>
      </Pressable>
    </View>
  );
}
