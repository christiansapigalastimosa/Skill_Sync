import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  Animated,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { useRouter } from "expo-router";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fade animations
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const nameAnim = useRef(new Animated.Value(0)).current;
  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const linkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(300, [
      Animated.timing(titleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(subtitleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(nameAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(emailAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(passwordAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(linkAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("⚠️ Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
      });

      alert("✅ Account created successfully!");
      router.replace("/"); // Go back to Login (Intro)
    } catch (error) {
      alert("Signup failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Animated.View style={{ opacity: titleAnim }}>
          <Text style={styles.title}>⚡ SkillSync Signup ⚡</Text>
        </Animated.View>

        <Animated.View style={{ opacity: subtitleAnim }}>
          <Text style={styles.subtitle}>
            Create your account to start tracking your skills 🚀
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: nameAnim }}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#888"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </Animated.View>

        <Animated.View style={{ opacity: emailAnim }}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Animated.View>

        <Animated.View style={{ opacity: passwordAnim }}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </Animated.View>

        <Animated.View style={{ opacity: buttonAnim }}>
          {loading ? (
            <ActivityIndicator size="large" color="#00fff7" style={{ marginVertical: 15 }} />
          ) : (
            <Pressable style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>🚀 Sign Up</Text>
            </Pressable>
          )}
        </Animated.View>

        <Animated.View style={{ opacity: linkAnim }}>
          <Pressable onPress={() => router.push("/")}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </Pressable>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00fff7",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Orbitron",
  },
  subtitle: {
    color: "#ccc",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderColor: "#00fff7",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 300,
  },
  button: {
    backgroundColor: "rgba(0,255,247,0.1)",
    borderColor: "#00fff7",
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    width: 300,
  },
  buttonText: {
    color: "#00fff7",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#ff00ff",
    textAlign: "center",
    marginTop: 10,
  },
});
