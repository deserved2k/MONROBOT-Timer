import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, onSnapshot, deleteDoc, getDocs } from "firebase/firestore";

// Replace these with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Manual Results
export async function saveManualResult(result) {
  try {
    await addDoc(collection(db, "manual_results"), {
      ...result,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error saving manual result:", error);
    throw error;
  }
}

export function subscribeToManualResults(callback) {
  const q = query(collection(db, "manual_results"));
  return onSnapshot(q, (querySnapshot) => {
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    callback(results);
  });
}

export async function clearAllManualResults() {
  try {
    const q = query(collection(db, "manual_results"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error clearing manual results:", error);
  }
}

// Automatic Results
export async function saveAutomaticResult(result) {
  try {
    await addDoc(collection(db, "automatic_results"), {
      ...result,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error saving automatic result:", error);
    throw error;
  }
}

export function subscribeToAutomaticResults(callback) {
  const q = query(collection(db, "automatic_results"));
  return onSnapshot(q, (querySnapshot) => {
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    callback(results);
  });
}

export async function clearAllAutomaticResults() {
  try {
    const q = query(collection(db, "automatic_results"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error clearing automatic results:", error);
  }
}
