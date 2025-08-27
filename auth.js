// auth.js

import { auth } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

// SIGN UP
window.signup = async function () {
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!username || !email || !password) {
    alert("Please fill in all signup fields.");
    return;
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Save locally
    localStorage.setItem("vf_username", username);
    localStorage.setItem("vf_user_email", email);
    localStorage.setItem("vf_user_uid", user.uid);
    localStorage.removeItem("vf_user_google"); // in case switching from Google

    const redirectUrl = localStorage.getItem("vf_redirect_after_login") || "index.html";
localStorage.removeItem("vf_redirect_after_login");
window.location.href = redirectUrl;

  } catch (error) {
    alert("Signup failed: " + error.message);
  }
};

// LOGIN
window.login = async function () {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!username || !password) {
    alert("Please enter username and password.");
    return;
  }

  // Construct email using @vandals.com domain
  const email = `${username}@vandals.com`;

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Save locally
    localStorage.setItem("vf_username", username);
    localStorage.setItem("vf_user_email", email);
    localStorage.setItem("vf_user_uid", user.uid);
    localStorage.removeItem("vf_user_google");

   const redirectUrl = localStorage.getItem("vf_redirect_after_login") || "index.html";
localStorage.removeItem("vf_redirect_after_login");
window.location.href = redirectUrl;

  } catch (error) {
    alert("Login failed: " + error.message);
  }
};

// GOOGLE SIGN-IN
window.googleSignIn = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save Google user info
    localStorage.setItem("vf_username", user.displayName);
    localStorage.setItem("vf_user_google", "true");
    localStorage.setItem("vf_user_email", user.email);
    localStorage.setItem("vf_user_photo", user.photoURL);
    localStorage.setItem("vf_user_uid", user.uid);

  const redirectUrl = localStorage.getItem("vf_redirect_after_login") || "index.html";
localStorage.removeItem("vf_redirect_after_login");
window.location.href = redirectUrl;

  } catch (error) {
    alert("Google Sign-In failed: " + error.message);
  }
};

// TOGGLE BETWEEN FORMS
window.showSignup = function () {
  document.getElementById("signupForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("formTitle").innerText = "Sign Up";
};

window.showLogin = function () {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("formTitle").innerText = "Login";
};
