// auth.js

import { auth } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const provider = new GoogleAuthProvider();


// ================= SIGNUP =================
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

    localStorage.setItem("vf_username", username);
    localStorage.setItem("vf_user_email", email);
    localStorage.setItem("vf_user_uid", user.uid);

    localStorage.setItem("vf_user", JSON.stringify({
      username,
      email,
      uid: user.uid,
      google: false
    }));

    const redirectUrl = localStorage.getItem("vf_redirect_after_login") || "index.html";
    localStorage.removeItem("vf_redirect_after_login");

    window.location.href = redirectUrl;

  } catch (error) {
    alert("Signup failed: " + error.message);
  }
};


// ================= LOGIN =================
window.login = async function () {

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    localStorage.setItem("vf_username", email.split("@")[0]);
    localStorage.setItem("vf_user_email", email);
    localStorage.setItem("vf_user_uid", user.uid);
    localStorage.setItem("vf_user_photo", "");

    localStorage.setItem("vf_user", JSON.stringify({
      email,
      uid: user.uid,
      google: false
    }));

    const redirectUrl = localStorage.getItem("vf_redirect_after_login") || "index.html";
    localStorage.removeItem("vf_redirect_after_login");

    window.location.href = redirectUrl;

  } catch (error) {
    alert("Login failed: " + error.message);
  }
};


// ================= GOOGLE LOGIN =================
window.googleSignIn = async function () {

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    localStorage.setItem("vf_username", user.displayName);
    localStorage.setItem("vf_user_email", user.email);
    localStorage.setItem("vf_user_uid", user.uid);
    localStorage.setItem("vf_user_photo", user.photoURL);

    localStorage.setItem("vf_user", JSON.stringify({
      username: user.displayName,
      email: user.email,
      uid: user.uid,
      google: true,
      photo: user.photoURL
    }));

    const redirectUrl = localStorage.getItem("vf_redirect_after_login") || "index.html";
    localStorage.removeItem("vf_redirect_after_login");

    window.location.href = redirectUrl;

  } catch (error) {
    alert("Google Sign-In failed: " + error.message);
  }
};


// ================= TOGGLE FORMS =================
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


// ================= PHONE AUTH =================

// Setup reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'invisible'
});

window.recaptchaVerifier.render();


// SEND OTP
window.sendOTP = async function () {

  let phone = document.getElementById("phoneNumber").value.trim();

  // Clean input
  phone = phone.replace(/\D/g, "");

  // Auto add +91
  if (phone.length === 10) {
    phone = "+91" + phone;
  } else if (phone.length === 12 && phone.startsWith("91")) {
    phone = "+" + phone;
  }

  if (!phone.startsWith("+") || phone.length < 12) {
    alert("Enter valid phone number");
    return;
  }

  try {
    window.confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);

    alert("OTP sent!");

    // Show OTP fields
    document.getElementById("otpCode").classList.remove("hidden");
    document.getElementById("verifyBtn").classList.remove("hidden");

  } catch (error) {
    alert("Error sending OTP: " + error.message);
  }
};


// VERIFY OTP
window.verifyOTP = async function () {

  const code = document.getElementById("otpCode").value;

  if (!window.confirmationResult) {
    alert("Please request OTP first");
    return;
  }

  if (!code) {
    alert("Enter OTP");
    return;
  }

  try {
    const result = await window.confirmationResult.confirm(code);
    const user = result.user;

    localStorage.setItem("vf_user_uid", user.uid);
    localStorage.setItem("vf_user_phone", user.phoneNumber);
    localStorage.setItem("vf_username", user.phoneNumber);

    localStorage.setItem("vf_user", JSON.stringify({
      username: user.phoneNumber,
      phone: user.phoneNumber,
      uid: user.uid,
      phoneLogin: true
    }));

    window.location.href = "index.html";

  } catch (error) {
    alert("Invalid OTP");
  }
};
