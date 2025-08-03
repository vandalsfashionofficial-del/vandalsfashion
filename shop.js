import { auth, db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const grid = document.getElementById('productGrid');

// 🔐 Profile UI
const profilePic = document.getElementById("profilePic");
const authLink = document.getElementById("authLink");
const userDropdown = document.getElementById("userDropdown");

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.photoURL) {
      profilePic.src = user.photoURL;
      profilePic.style.display = "inline-block";
      authLink.style.display = "none";
    }
  }
});

profilePic?.addEventListener("click", () => {
  userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
});

window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "auth.html";
  });
};

// 🔄 Load Products
async function loadProducts() {
  const snapshot = await getDocs(collection(db, "products"));
  const products = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.displayOn === "shop" || data.displayOn === "both") {
      products.push(data);
    }
  });

  if (products.length === 0) {
    grid.innerHTML = "<p style='text-align:center; color:#888;'>No products found.</p>";
    return;
  }

  grid.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.imageUrl}" alt="${p.name}">
      <div class="card-content">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button class="btn" onclick="addToCart('${p.name}', ${p.price}, '${p.imageUrl}')">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

window.addToCart = (name, price, imageUrl) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push({ name, price, imageUrl });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
};

loadProducts();
