import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function Home() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Welcome to SkillSync Goals</Text>

      <Text style={styles.subtitle}>
        {user ? `Hello, ${user.email} 👋` : "Welcome, Guest 👋"}
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => router.push("/goals")}>
          <Text style={styles.buttonText}>📋 View My Goals</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.createButton]}
          onPress={() => router.push("/goals/create")}
        >
          <Text style={styles.buttonText}>➕ Create New Goal</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00fff7",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#aaa",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  button: {
    backgroundColor: "rgba(0,255,247,0.15)",
    borderColor: "#00fff7",
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  createButton: {
    borderColor: "#00ff88",
  },
  logoutButton: {
    borderColor: "#ff004c",
  },
  buttonText: {
    color: "#00fff7",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutText: {
    color: "#ff004c",
    fontWeight: "bold",
    fontSize: 16,
  },
});
