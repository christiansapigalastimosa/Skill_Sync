import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGoals } from "../../hooks/useGoals";

export default function EditGoal() {
  const { id, title } = useLocalSearchParams(); // passed when navigating
  const [newTitle, setNewTitle] = useState(title || "");
  const { updateGoal } = useGoals();
  const router = useRouter();

  const handleUpdate = async () => {
    if (!newTitle.trim()) return alert("Goal cannot be empty!");
    await updateGoal(id, newTitle);
    router.back(); // go back to goals list
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Edit Goal</Text>

      <TextInput
        style={styles.input}
        value={newTitle}
        onChangeText={setNewTitle}
        placeholder="Edit your goal..."
        placeholderTextColor="#888"
      />

      <Pressable style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>💾 Save Changes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#00fff7", marginBottom: 20, textAlign: "center" },
  input: {
    borderColor: "#00fff7",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  button: {
    backgroundColor: "#00fff7",
    padding: 15,
    borderRadius: 12,
  },
  buttonText: { color: "#000", fontWeight: "bold", textAlign: "center" },
});
