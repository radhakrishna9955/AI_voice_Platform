import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDR6PGz9y1vEBGuv0SlN9JVkgKUOduWCBA",
  authDomain: "interviewiq-58de4.firebaseapp.com",
  projectId: "interviewiq-58de4",
  storageBucket: "interviewiq-58de4.firebasestorage.app",
  messagingSenderId: "72695999706",
  appId: "1:72695999706:web:8e0af77c5644c3830289e3",
  measurementId: "G-YBXF92ZZG9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);