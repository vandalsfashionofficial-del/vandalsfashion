// explore.js
import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const profilePic = document.getElementById("profile-Pic");
const authLink = document.getElementById("authLink");
const userDropdown = document.getElementById("userDropdown");

const categories = [
  "Pakistani Luxe Wear",
  "Designer",
  "Trendy",
  "Lehenga",
  "Indo-Western",
  "Western",
  "Embroidery"
];

const container = document.getElementById("categoryContainer");

// Load category banners
categories.forEach((cat) => {
  const box = document.createElement("div");
  box.className = "category-box";
  box.textContent = cat;

  // ✅ Make it clickable
  box.onclick = () => {
    window.location.href = `shop.html?category=${encodeURIComponent(cat)}`;
  };

  container.appendChild(box);
});


// Auth UI
onAuthStateChanged(auth, (user) => {
  if (user && user.photoURL) {
    profilePic.src = user.photoURL;
    profilePic.style.display = "inline-block";
    authLink.style.display = "none";
  }
});

profilePic?.addEventListener("click", () => {
  userDropdown.style.display =
    userDropdown.style.display === "block" ? "none" : "block";
});

window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "auth.html";
  });
};

