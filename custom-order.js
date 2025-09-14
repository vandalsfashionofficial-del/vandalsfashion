// custom-order.js
import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const profileContainer = document.getElementById("profileContainer");
const profilePic = document.getElementById("profile-Pic");
const authLink = document.getElementById("authLink");
const profileDropdown = document.getElementById("profileDropdown");

// Auth UI
onAuthStateChanged(auth, (user) => {
  if (user && user.photoURL) {
    profilePic.src = user.photoURL;
    profileContainer.style.display = "block"; // ✅ show whole container
    authLink.style.display = "none";
  } else {
    profileContainer.style.display = "none"; // hide when logged out
    authLink.style.display = "inline-block";
  }
});

// Toggle dropdown
profilePic?.addEventListener("click", () => {
  if (profileDropdown) {
    profileDropdown.style.display =
      profileDropdown.style.display === "block" ? "none" : "block";
  }
});

// Logout
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "auth.html";
  });
};
