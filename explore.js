// explore.js
import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const grid = document.getElementById('productGrid');
const profilePic = document.getElementById("profilePic");
const authLink = document.getElementById("authLink");
const userDropdown = document.getElementById("userDropdown");

// 🔄 Load Explore Products
async function loadExploreProducts() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    const products = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.displayOn === "explore" || data.displayOn === "both") {
        products.push({ ...data, id: doc.id });
      }
    });

    if (products.length === 0) {
      grid.innerHTML = "<p style='text-align:center;'>No products found.</p>";
      return;
    }

    grid.innerHTML = "";
    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.imageUrl}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="location.href='product.html?id=${p.id}'">View</button>
      `;
      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading explore products:", error);
    grid.innerHTML = "<p style='text-align:center; color:red;'>Error loading products.</p>";
  }
}

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

loadExploreProducts();
