import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";

const { height, width } = Dimensions.get("window");

export default function IntroLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    // 🌀 Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // ⏳ Show login form after 2.5 seconds
    const timer = setTimeout(() => setShowLogin(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {!showLogin ? (
          // 🌟 Intro Section
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.title}>⚡ Welcome to SkillSync ⚡</Text>
            <Text style={styles.subtitle}>
              Track, Improve, and Showcase your Skills 🚀
            </Text>
          </Animated.View>
        ) : (
          // 🔑 Login Section
          <Animated.View
            style={[styles.loginContainer, { opacity: fadeAnim }]}
          >
            <Text style={styles.title}>Login to Continue</Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <Pressable style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>🚀 Login</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/signup")}>
              <Text style={styles.link}>Don't have an account? Signup</Text>
            </Pressable>
          </Animated.View>
        )}
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
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  loginContainer: {
    width: "100%",
    maxWidth: 400,
  },
  input: {
    borderColor: "#00fff7",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: "#fff",
  },
  button: {
    backgroundColor: "rgba(0,255,247,0.1)",
    borderColor: "#00fff7",
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonText: {
    color: "#00fff7",
    textAlign: "center",
    fontWeight: "bold",
  },
  link: {
    color: "#ff00ff",
    textAlign: "center",
    marginTop: 10,
  },
});
