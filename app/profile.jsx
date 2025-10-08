import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "expo-router";
import Animated, {
  FadeIn,
  SlideInUp,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function Profile() {
  const user = auth.currentUser;
  const router = useRouter();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const refDoc = doc(db, "profiles", user.uid);
      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setBio(data.bio || "");
        setAvatar(data.avatar || null);
      }
    } catch (err) {
      Alert.alert("Error loading profile", err.message);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `avatars/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setAvatar(downloadURL);
    } catch (err) {
      Alert.alert("Upload failed", err.message);
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const refDoc = doc(db, "profiles", user.uid);
      const profileData = { name, bio, email, avatar, uid: user.uid };
      await setDoc(refDoc, profileData);

      setName(profileData.name);
      setBio(profileData.bio);
      setAvatar(profileData.avatar);
      setIsEditing(false);

      Alert.alert("✅ Profile Saved!", "Your profile info was updated.");
      // Do NOT redirect anywhere
    } catch (err) {
      Alert.alert("Error saving", err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/");
    } catch (err) {
      Alert.alert("❌ Logout Failed", err.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Avatar */}
          <Animated.View
            style={[styles.avatarWrapper, animatedAvatarStyle]}
            entering={FadeIn.delay(400).duration(800)}
          >
            <Pressable onPress={handlePickImage}>
              {uploading ? (
                <ActivityIndicator size="large" color="#00ff99" />
              ) : (
                <Image
                  source={
                    avatar
                      ? { uri: avatar }
                      : require("../assets/images/defaultProfile.jpg")
                  }
                  style={styles.avatar}
                />
              )}
            </Pressable>
          </Animated.View>

          {/* Name & Bio */}
          <Animated.View
            style={styles.infoCard}
            entering={FadeIn.delay(600).duration(800)}
          >
            <Text style={styles.name}>{name || "Your Name"}</Text>
            <Text style={styles.bio}>{bio || "Add a short bio about yourself..."}</Text>
          </Animated.View>

          {/* Edit Button */}
          {!isEditing && (
            <Pressable
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
            </Pressable>
          )}

          {/* Editable Profile Card */}
          {isEditing && (
            <Animated.View style={styles.infoCard} entering={SlideInUp.duration(500)}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#aaa"
              />

              <Text style={styles.label}>Bio</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                style={[styles.input, { height: 80 }]}
                placeholder="Short Bio"
                placeholderTextColor="#aaa"
                multiline
              />

              <Pressable style={styles.button} onPress={saveProfile}>
                <Text style={styles.buttonText}>💾 Save Profile</Text>
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>

        {/* Footer with Home & Logout */}
        <View style={styles.footer}>
          <Pressable style={styles.homeButton} onPress={() => router.push("/goals")}>
            <Text style={styles.homeText}>🏠 Home</Text>
          </Pressable>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width, height },
  scroll: { paddingTop: 50, paddingBottom: 140 },
  avatarWrapper: { alignItems: "center", marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#00ff99",
  },
  infoCard: {
    backgroundColor: "#111111",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  name: { fontSize: 20, fontWeight: "bold", color: "#00ff99", textAlign: "center" },
  bio: { fontSize: 12, color: "#ffffff", textAlign: "center", marginTop: 4 },
  label: { fontSize: 12, color: "#ffffff", marginTop: 8 },
  input: {
    backgroundColor: "#222222",
    borderColor: "#00ff99",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: "#ffffff",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#00ff99",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: { color: "#000000", fontWeight: "bold", textAlign: "center" },
  editButton: {
    backgroundColor: "#00ff99",
    marginHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  editButtonText: { color: "#000000", textAlign: "center", fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    gap: 8,
  },
  homeButton: {
    flex: 1,
    backgroundColor: "#00ff99",
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#00ff99",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  homeText: { color: "#000000", textAlign: "center", fontWeight: "bold" },
  logoutButton: {
    flex: 1,
    backgroundColor: "#ff69b4",
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#ff69b4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  logoutText: { color: "#000000", textAlign: "center", fontWeight: "bold" },
});
