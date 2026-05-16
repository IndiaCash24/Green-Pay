import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdgSV8Uipfj5euV2_XuBoSN-dZD2E9_1I",
  authDomain: "loan-project-87029.firebaseapp.com",
  projectId: "loan-project-87029",
  storageBucket: "loan-project-87029.firebasestorage.app",
  messagingSenderId: "704490291696",
  appId: "1:704490291696:web:91df70946838f85c075d35",
  measurementId: "G-3JB932G5LE"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
