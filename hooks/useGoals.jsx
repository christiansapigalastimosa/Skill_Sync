import { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export function useGoals() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = collection(db, "users", user.uid, "goals");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGoals(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const createGoal = async (title) => {
    const user = auth.currentUser;
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "goals"), {
      title,
      createdAt: new Date(),
    });
  };

  const deleteGoal = async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "goals", id));
  };

  const updateGoal = async (id, newTitle) => {
    const user = auth.currentUser;
    if (!user) return;
    const goalRef = doc(db, "users", user.uid, "goals", id);
    await updateDoc(goalRef, { title: newTitle });
  };

  return { goals, createGoal, deleteGoal, updateGoal };
}
