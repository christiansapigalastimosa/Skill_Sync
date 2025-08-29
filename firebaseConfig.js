
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIudcMfyNXCIY_4Rd5Mf47PU-yv2gsF24",
  authDomain: "goalproject-csl.firebaseapp.com",
  projectId: "goalproject-csl",
  storageBucket: "goalproject-csl.firebasestorage.app",
  messagingSenderId: "301384366399",
  appId: "1:301384366399:web:dbb50bcfc22dc916643b8a"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)