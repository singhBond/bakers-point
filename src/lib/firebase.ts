// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDhRHsyNag-EISiALHPKBBANOAnUv4VJHM",
  authDomain: "bakery-cat.firebaseapp.com",
  projectId: "bakery-cat",
  storageBucket: "bakery-cat.firebasestorage.app",
  messagingSenderId: "690941478278",
  appId: "1:690941478278:web:e4e514bc5a242b78d31807"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional: Export app if needed elsewhere
export default app;