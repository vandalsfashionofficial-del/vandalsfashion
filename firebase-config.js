// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

// Your Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyAoVwaiSqtp_r3c7UgqxkTlu7EedRqnzJE",
  authDomain: "vandals-fashion.firebaseapp.com",
  projectId: "vandals-fashion",
  storageBucket: "vandals-fashion.appspot.com",
  messagingSenderId: "273607679264",
  appId: "1:273607679264:web:77166ec46f479b082d8b45"
};

// ✅ Initialize Firebase and export all services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Correct placement

