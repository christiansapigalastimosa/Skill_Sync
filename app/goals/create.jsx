import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useGoals } from "../../hooks/useGoals";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function CreateGoal() {
  const [title, setTitle] = useState("");
  const { createGoal } = useGoals();
  const router = useRouter();

  const handleAdd = async () => {
    if (!title.trim())
      return Alert.alert("⚠️ Required", "Please enter a goal first.");
    await createGoal(title);
    Alert.alert("🎯 Success", "Your goal has been added!", [
      { text: "OK", onPress: () => router.push("/goals") },
    ]);
    setTitle("");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.85)", "rgba(0,15,30,0.9)"]}
        style={styles.overlay}
      />

      <View style={styles.container}>
        <Animated.View entering={FadeInDown.delay(100).duration(800)}>
          <Text style={styles.title}>🎯 Create a New Goal</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(800)}>
          <TextInput
            placeholder="Type your goal here..."
            placeholderTextColor="#00fff7"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(800)}>
          <Pressable style={styles.button} onPress={handleAdd}>
            <LinearGradient
              colors={["#00fff7", "#00b8a9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>✅ Save Goal</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).duration(800)}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/goals")}
          >
            <Text style={styles.secondaryText}>📋 View My Goals</Text>
          </Pressable>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    width,
    height,
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#00fff7",
    textAlign: "center",
    marginBottom: 24,
    textShadowColor: "#00fff7",
    textShadowRadius: 12,
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,255,247,0.6)",
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: "#eaffff",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  button: {
    borderRadius: 14,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 14,
  },
  buttonText: {
    color: "#001a1a",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: 20,
    borderColor: "#00fff7",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,255,247,0.08)",
  },
  secondaryText: {
    color: "#00fff7",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
});
