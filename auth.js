import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.signup = async function () {
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    localStorage.setItem("vf_username", username);
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

window.login = async function () {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const email = `${username}@vandals.com`;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("vf_username", username);
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

window.googleSignIn = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    localStorage.setItem("vf_username", user.displayName);
    localStorage.setItem("vf_user_photo", user.photoURL);
    window.location.href = "index.html";
  } catch (error) {
    alert("Google sign-in failed: " + error.message);
  }
};

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
