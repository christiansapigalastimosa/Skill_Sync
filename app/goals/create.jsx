import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useGoals } from "../../hooks/useGoals";
import { useRouter } from "expo-router";

export default function CreateGoal() {
  const [title, setTitle] = useState("");
  const { createGoal } = useGoals();
  const router = useRouter();

  const handleAdd = async () => {
    if (!title.trim()) return alert("Goal cannot be empty!");
    await createGoal(title);

    // ✅ Success feedback
    Alert.alert("🎯 Goal Added!", "Your new goal has been successfully saved.", [
      {
        text: "OK",
        onPress: () => router.push("/goals"), // Go to goals after closing alert
      },
    ]);

    setTitle(""); // clear input
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Add New Goal</Text>

      <TextInput
        placeholder="Enter goal..."
        placeholderTextColor="#888"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>✅ Save Goal</Text>
      </Pressable>

      <Pressable style={styles.homeButton} onPress={() => router.push("/goals")}>
        <Text style={styles.homeButtonText}>📋 See your Goals</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff00ff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#ff00ff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: "#fff",
  },
  button: {
    backgroundColor: "rgba(255,0,255,0.1)",
    borderColor: "#ff00ff",
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: "#ff00ff",
    textAlign: "center",
    fontWeight: "bold",
  },
  homeButton: {
    marginTop: 15,
    backgroundColor: "rgba(255,0,255,0.2)",
    borderColor: "#ff00ff",
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
  },
  homeButtonText: {
    color: "#ff00ff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
