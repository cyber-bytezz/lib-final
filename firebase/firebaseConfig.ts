import { initializeApp } from "firebase/app";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
// Use the underlying package directly for types if proxy exports in 'firebase/auth' are failing
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0NTAvOoA-sJOHCQ5NnH9ml5uR6G-GiwU",
  authDomain: "sai-ram001.firebaseapp.com",
  projectId: "sai-ram001",
  storageBucket: "sai-ram001.firebasestorage.app",
  messagingSenderId: "428250497696",
  appId: "1:428250497696:web:ec0eb9522a69e463c1ffc5",
  measurementId: "G-S5XMH7JGCR"
};

const app = initializeApp(firebaseConfig);
// Initialize Firestore with persistent cache
// This replaces the deprecated enableMultiTabIndexedDbPersistence
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Directly call getAuth imported from the core auth package
export const auth = getAuth(app);