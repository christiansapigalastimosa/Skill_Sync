import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  ImageBackground,
  SafeAreaView,
  Image,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGoals } from "../../hooks/useGoals";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function GoalsList() {
  const { goals, deleteGoal, updateGoal } = useGoals();
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animation ref

  // ✅ Fetch profile photo from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "profiles", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.photoURL) setProfilePic(data.photoURL);
      }
    };
    fetchProfile();

    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSaveEdit = async (id) => {
    if (!newTitle.trim()) return alert("Goal title cannot be empty!");
    await updateGoal(id, newTitle);
    setEditingId(null);
    setNewTitle("");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeContainer}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {/* 👤 Floating Profile Picture */}
          <Pressable
            style={({ pressed }) => [
              styles.profileContainer,
              pressed && { transform: [{ scale: 0.95 }], opacity: 0.8 },
            ]}
            onPress={() => router.push("/profile")}
          >
            <Image
              source={
                profilePic
                  ? { uri: profilePic }
                  : require("../../assets/images/defaultProfile.jpg")
              }
              style={styles.profileImage}
            />
          </Pressable>

          <View style={styles.container}>
            <Text style={styles.title}>🎯 My Goals</Text>
            <Text style={styles.subtitle}>
              Stay focused — track your progress and grow your skills.
            </Text>

            {/* 📋 Goals List */}
            {goals.length === 0 ? (
              <Text style={styles.empty}>No goals yet. Tap ➕ to add one!</Text>
            ) : (
              <FlatList
                data={goals}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
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
                          <Ionicons name="save-outline" size={20} color="#00ff88" />
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={() => {
                            setEditingId(item.id);
                            setNewTitle(item.title);
                          }}
                        >
                          <Ionicons name="create-outline" size={20} color="#00fff7" />
                        </Pressable>
                      )}

                      <Pressable onPress={() => deleteGoal(item.id)}>
                        <Ionicons name="trash-outline" size={20} color="#ff004c" />
                      </Pressable>
                    </View>
                  </View>
                )}
              />
            )}

            {/* ➕ Add Goal Button */}
            <Pressable
              style={[styles.bottomButton, styles.addButton]}
              onPress={() => router.push("/goals/create")}
            >
              <Ionicons name="add-circle-outline" size={20} color="#000" />
              <Text style={styles.addButtonText}>Add New Goal</Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.7)" },
  safeContainer: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 22, paddingTop: 80, paddingBottom: 30 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00fff7",
    textAlign: "center",
    textShadowColor: "#00fff7",
    textShadowRadius: 12,
  },
  subtitle: { color: "#ccc", fontSize: 14, textAlign: "center", marginBottom: 25 },
  empty: { color: "#aaa", textAlign: "center", marginTop: 40, fontSize: 16 },
  goalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 247, 0.1)",
    borderColor: "#00fff7",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: "#00fff7",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  goalText: { color: "#fff", fontSize: 16, flex: 1 },
  editInput: {
    borderColor: "#00fff7",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    color: "#fff",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 12, marginLeft: 10 },
  bottomButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
    backgroundColor: "#00fff7",
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: "#00fff7",
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  profileContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 40 : 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderColor: "#00fff7",
    borderWidth: 1,
    borderRadius: 50,
    padding: 3,
    zIndex: 10,
    shadowColor: "#00fff7",
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  profileImage: { width: 45, height: 45, borderRadius: 50, borderWidth: 2, borderColor: "#00fff7" },
});
