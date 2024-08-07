
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcekE5b1wpKXMMvVwgaZfGyMIXFAFo3PA",
  authDomain: "chessvia.firebaseapp.com",
  projectId: "chessvia",
  storageBucket: "chessvia.appspot.com",
  messagingSenderId: "53699365938",
  appId: "1:53699365938:web:121b7563e4a6710691002b",
  measurementId: "G-5S6BKD2YL0"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
