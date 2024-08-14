
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcekE5b1wpKXMMvVwgaZfGyMIXFAFo3PA123",
  authDomain: "chessvia123.firebaseapp.com",
  projectId: "chessvia123",
  storageBucket: "chessvia123.appspot.com",
  messagingSenderId: "53699365938123",
  appId: "1:53699365938:web:121b7563e4a6710691002b123",
  measurementId: "G-5S6BKD2YL0123"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
