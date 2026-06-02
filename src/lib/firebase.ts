import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDdL0dhs7n48BF6gZpVaSTapNF1vxHHh-k",
  authDomain: "jobs-e038b.firebaseapp.com",
  projectId: "jobs-e038b",
  storageBucket: "jobs-e038b.firebasestorage.app",
  messagingSenderId: "93102026777",
  appId: "1:93102026777:web:75a528de2daa903b74ba88",
  measurementId: "G-VE124HR534",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
