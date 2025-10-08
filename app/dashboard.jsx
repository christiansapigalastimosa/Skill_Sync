import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  SafeAreaView,
  Platform,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState(null);
  const userName = auth.currentUser?.displayName || auth.currentUser?.email;

  const fadeAnim = useRef(new Animated.Value(0)).current; // Animation ref

  // Fetch user profile photo from Firestore
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

    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeContainer}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim, alignItems: "center" }}>
          {/* Floating Profile Picture */}
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
                  : require("../assets/images/defaultProfile.jpg")
              }
              style={styles.profileImage}
            />
          </Pressable>

          <View style={styles.container}>
            {/* Welcome */}
            <Text style={styles.title}>⚡ Welcome, {userName}! ⚡</Text>
            <Text style={styles.subtitle}>Your goals, all in one place.</Text>

            {/* Dashboard Buttons */}
            <Pressable style={styles.button} onPress={() => router.push("/goals")}>
              <Ionicons name="flag-outline" size={22} color="#00fff7" />
              <Text style={styles.buttonText}>My Goals</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => router.push("/goals/create")}>
              <Ionicons name="add-circle-outline" size={22} color="#00fff7" />
              <Text style={styles.buttonText}>Create Goal</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#ff004c" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  bg: { flex: 1, width, height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  safeContainer: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00fff7",
    textAlign: "center",
    textShadowColor: "#00fff7",
    textShadowRadius: 12,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,255,247,0.08)",
    borderColor: "#00fff7",
    borderWidth: 1,
    borderRadius: 14,
    width: "80%",
    marginBottom: 16,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#00fff7",
    fontSize: 16,
    textTransform: "uppercase",
  },
  logoutButton: {
    backgroundColor: "rgba(255,0,76,0.08)",
    borderColor: "#ff004c",
  },
  logoutText: {
    fontWeight: "bold",
    color: "#ff004c",
    fontSize: 16,
    textTransform: "uppercase",
  },
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
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#00fff7",
  },
});
