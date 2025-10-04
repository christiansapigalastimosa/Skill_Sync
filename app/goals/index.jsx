import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, TextInput } from "react-native";
import { useGoals } from "../../hooks/useGoals";
import { useRouter } from "expo-router";

export default function GoalsList() {
  const { goals, deleteGoal, updateGoal } = useGoals();
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const handleSaveEdit = async (id) => {
    if (!newTitle.trim()) return alert("Goal title cannot be empty!");
    await updateGoal(id, newTitle);
    setEditingId(null);
    setNewTitle("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📌 My Goals</Text>

      {goals.length === 0 ? (
        <Text style={styles.empty}>No goals yet. Tap ➕ to add one!</Text>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.goalItem}>
              {editingId === item.id ? (
                <TextInput
                  style={styles.editInput}
                  value={newTitle}
                  onChangeText={setNewTitle}
                  placeholder="Edit goal..."
                  placeholderTextColor="#aaa"
                />
              ) : (
                <Text style={styles.goalText}>{item.title}</Text>
              )}

              <View style={styles.actions}>
                {editingId === item.id ? (
                  <Pressable onPress={() => handleSaveEdit(item.id)}>
                    <Text style={styles.saveText}>💾</Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={() => { setEditingId(item.id); setNewTitle(item.title); }}>
                    <Text style={styles.editText}>✏️</Text>
                  </Pressable>
                )}

                <Pressable onPress={() => deleteGoal(item.id)}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      <Pressable style={styles.addButton} onPress={() => router.push("/goals/create")}>
        <Text style={styles.addButtonText}>➕ Add Goal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00fff7",
    marginBottom: 20,
    textAlign: "center",
  },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  goalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 247, 0.1)",
    borderColor: "#00fff7",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  goalText: { color: "#fff", fontSize: 16, flex: 1 },
  editInput: {
    borderColor: "#00fff7",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    color: "#fff",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginLeft: 10,
  },
  editText: { color: "#00fff7", fontSize: 18 },
  saveText: { color: "#00ff88", fontSize: 18 },
  deleteText: { color: "#ff004c", fontSize: 18 },
  addButton: {
    marginTop: 20,
    backgroundColor: "#00fff7",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
