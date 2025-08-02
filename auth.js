import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// SIGN UP
window.signup = async function () {
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    localStorage.setItem("vf_username", username);
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

// LOGIN
window.login = async function () {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const email = `${username}@vandals.com`;

  if (!username || !password) {
    alert("Please enter username and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("vf_username", username);
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

// GOOGLE SIGN-IN
window.googleSignIn = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    localStorage.setItem("vf_username", user.displayName);
    localStorage.setItem("vf_user_photo", user.photoURL);
    localStorage.setItem("vf_user_google", JSON.stringify({
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      uid: user.uid
    }));

    window.location.href = "index.html";
  } catch (error) {
    alert("Google sign-in failed: " + error.message);
    console.error(error);
  }
};

// FORM SWITCH
window.showSignup = () => {
  document.getElementById("signupForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("formTitle").innerText = "Sign Up";
};

window.showLogin = () => {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("formTitle").innerText = "Login";
};
