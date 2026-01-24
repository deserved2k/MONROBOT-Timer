import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, onSnapshot, deleteDoc, getDocs } from "firebase/firestore";

// Replace these with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCucgETvfP782hua_mdgn9PZ7FseBFGhTc",
  authDomain: "monrobot-2026.firebaseapp.com",
  projectId: "monrobot-2026",
  storageBucket: "monrobot-2026.firebasestorage.app",
  messagingSenderId: "197425183097",
  appId: "1:197425183097:web:9df189d3e76176dffa57a8"
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
