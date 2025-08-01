// auth.js
import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Session persistence (auto-login across tabs/reload)
setPersistence(auth, browserLocalPersistence);

// Toggle forms
window.showSignup = () => {
  document.getElementById("formTitle").innerText = "Sign Up";
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");
};

window.showLogin = () => {
  document.getElementById("formTitle").innerText = "Login";
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
};

// Signup logic
window.signup = async () => {
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!username || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  const docRef = doc(db, "usernames", username);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    alert("Username already taken.");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "usernames", username), {
      uid: userCred.user.uid,
      email: email
    });

    alert("Signup successful!");
    window.location.href = "index.html";
  } catch (error) {
    alert("Signup Error: " + error.message);
  }
};

// Login logic
window.login = async () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!username || !password) {
    alert("Please fill all fields.");
    return;
  }

  const docRef = doc(db, "usernames", username);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    alert("Username not found.");
    return;
  }

  const { email } = docSnap.data();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "index.html";
  } catch (error) {
    alert("Login Error: " + error.message);
  }
};
