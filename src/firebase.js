import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAq25z07XlVOuBuEfytWiOxnhT1jpkZQ14",
  authDomain: "gradetrack-f70f0.firebaseapp.com",
  projectId: "gradetrack-f70f0",
  storageBucket: "gradetrack-f70f0.firebasestorage.app",
  messagingSenderId: "264953410422",
  appId: "1:264953410422:web:68a5504bff0dcd81dec057",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
