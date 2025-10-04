import { createContext, useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";

export const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const goalsCollection = collection(db, "goals");
    const unsubscribe = onSnapshot(
      goalsCollection,
      snapshot => setGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
      error => console.error(error)
    );
    return () => unsubscribe();
  }, []);

  const createGoal = async newGoal => { await addDoc(collection(db, "goals"), newGoal); };
  const updateGoal = async (id, updatedFields) => { await updateDoc(doc(db, "goals", id), updatedFields); };
  const deleteGoal = async id => { await deleteDoc(doc(db, "goals", id)); };

  return (
    <GoalsContext.Provider value={{ goals, createGoal, updateGoal, deleteGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};
