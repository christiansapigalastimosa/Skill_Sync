import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard"); // Go to Dashboard
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ SkillSync Login ⚡</Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", justifyContent: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#00fff7", textAlign: "center", marginBottom: 20 },
  input: { borderColor: "#00fff7", borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12, color: "#fff" },
  button: { backgroundColor: "rgba(0,255,247,0.1)", borderColor: "#00fff7", borderWidth: 1, padding: 15, borderRadius: 12, marginBottom: 15 },
  buttonText: { color: "#00fff7", textAlign: "center", fontWeight: "bold" },
  link: { color: "#ff00ff", textAlign: "center", marginTop: 10 }
});
