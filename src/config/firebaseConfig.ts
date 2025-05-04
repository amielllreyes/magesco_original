import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC3Wfo-ZGA-3KF0X_bP6MK5ODP6vobhIPk",
  authDomain: "magesco-dc13c.firebaseapp.com",
  projectId: "magesco-dc13c",
  storageBucket: "magesco-dc13c.firebasestorage.app",
  messagingSenderId: "722745586547",
  appId: "1:722745586547:web:feba81ca9b11d1ae9d8b06",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);


