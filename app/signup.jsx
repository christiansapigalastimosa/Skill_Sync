import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { useRouter } from "expo-router";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
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

      // Redirect to Login after signup
      router.replace("/"); 
    } catch (error) {
      alert("Signup failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ SkillSync Signup ⚡</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#888"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

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

      {loading ? (
        <ActivityIndicator size="large" color="#00fff7" style={{ marginVertical: 15 }} />
      ) : (
        <Pressable style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>🚀 Sign Up</Text>
        </Pressable>
      )}

      <Pressable onPress={() => router.push("/")}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
