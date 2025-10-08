import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGoals } from "../../hooks/useGoals";
import Toast from "react-native-toast-message";

export default function EditGoal() {
  const { id, title } = useLocalSearchParams();
  const [newTitle, setNewTitle] = useState(title || "");
  const { updateGoal, deleteGoal } = useGoals(); // ✅ added deleteGoal
  const router = useRouter();

  const handleUpdate = async () => {
    if (!newTitle.trim()) {
      return Toast.show({
        type: "error",
        text1: "⚠️ Goal cannot be empty!",
        text2: "Please enter a valid goal before saving.",
        position: "top",
        visibilityTime: 2500,
      });
    }

    try {
      await updateGoal(id, newTitle);

      Toast.show({
        type: "success",
        text1: "✅ Goal updated successfully!",
        text2: "Your changes have been saved.",
        position: "top",
        visibilityTime: 2500,
      });

      setTimeout(() => router.back(), 1000);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "❌ Failed to update goal",
        text2: "Something went wrong. Please try again.",
        position: "top",
        visibilityTime: 2500,
      });
    }
  };

  const handleDelete = () => {
    // Confirm deletion
    Alert.alert(
      "⚠️ Delete Goal",
      "Are you sure you want to delete this goal?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGoal(id);
              Toast.show({
                type: "success",
                text1: "🗑 Goal deleted",
                text2: "Your goal has been removed.",
                position: "top",
                visibilityTime: 2500,
              });
              setTimeout(() => router.back(), 1000);
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "❌ Failed to delete goal",
                text2: "Something went wrong. Please try again.",
                position: "top",
                visibilityTime: 2500,
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
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

      <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
        <Text style={styles.buttonText}>🗑 Delete Goal</Text>
      </Pressable>

      <Toast />
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
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#ff0044", // red for delete
  },
  buttonText: { color: "#000", fontWeight: "bold", textAlign: "center" },
});
