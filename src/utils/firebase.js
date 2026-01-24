import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove, get } from "firebase/database";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCucgETvfP782hua_mdgn9PZ7FseBFGhTc",
  authDomain: "monrobot-2026.firebaseapp.com",
  databaseURL: "https://monrobot-2026-default-rtdb.asia-southeast1.firebasedatabase.app/", // You'll need to add this
  projectId: "monrobot-2026",
  storageBucket: "monrobot-2026.firebasestorage.app",
  messagingSenderId: "197425183097",
  appId: "1:197425183097:web:9df189d3e76176dffa57a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Manual Results
export async function saveManualResult(result) {
  try {
    const resultsRef = ref(db, "manual_results");
    await push(resultsRef, {
      ...result,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Error saving manual result:", error);
    throw error;
  }
}

export function subscribeToManualResults(callback) {
  const resultsRef = ref(db, "manual_results");
  return onValue(resultsRef, (snapshot) => {
    const results = [];
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach((key) => {
        results.push({ id: key, ...data[key] });
      });
    }
    callback(results);
  }, (error) => {
    console.error("Error subscribing to manual results:", error);
  });
}

export async function clearAllManualResults() {
  try {
    const resultsRef = ref(db, "manual_results");
    await remove(resultsRef);
  } catch (error) {
    console.error("Error clearing manual results:", error);
  }
}

// Automatic Results
export async function saveAutomaticResult(result) {
  try {
    const resultsRef = ref(db, "automatic_results");
    await push(resultsRef, {
      ...result,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Error saving automatic result:", error);
    throw error;
  }
}

export function subscribeToAutomaticResults(callback) {
  const resultsRef = ref(db, "automatic_results");
  return onValue(resultsRef, (snapshot) => {
    const results = [];
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach((key) => {
        results.push({ id: key, ...data[key] });
      });
    }
    callback(results);
  }, (error) => {
    console.error("Error subscribing to automatic results:", error);
  });
}

export async function clearAllAutomaticResults() {
  try {
    const resultsRef = ref(db, "automatic_results");
    await remove(resultsRef);
  } catch (error) {
    console.error("Error clearing automatic results:", error);
  }
}