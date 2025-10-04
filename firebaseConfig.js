// firebaseConfig.js
// Required polyfills for Firebase in Expo (do this before importing firebase SDK modules)
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIudcMfyNXCIY_4Rd5Mf47PU-yv2gsF24",
  authDomain: "goalproject-csl.firebaseapp.com",
  projectId: "goalproject-csl",
  storageBucket: "goalproject-csl.firebasestorage.app",
  messagingSenderId: "301384366399",
  appId: "1:301384366399:web:dbb50bcfc22dc9166438a"
};

// initialize app (avoid duplicate initialization)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
