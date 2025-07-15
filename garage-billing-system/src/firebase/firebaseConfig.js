import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCy5sEOdhXykfpecYFmNm1Jwjb7zPwZk-8",
  authDomain: "garage-billing-system.firebaseapp.com",
  projectId: "garage-billing-system",
  storageBucket: "garage-billing-system.firebasestorage.app",
  messagingSenderId: "1065688561132",
  appId: "1:1065688561132:web:54eb7c7e8ad40b360e3cc9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };