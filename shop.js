// shop.js
import { auth, db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const grid = document.getElementById('productGrid');
const profilePic = document.getElementById("profilePic");
const authLink = document.getElementById("authLink");
const userDropdown = document.getElementById("userDropdown");

// 🔐 Profile UI
onAuthStateChanged(auth, (user) => {
  if (user && user.photoURL) {
    profilePic.src = user.photoURL;
    profilePic.style.display = "inline-block";
    authLink.style.display = "none";
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

// 🔄 Load Shop Products
async function loadProducts() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    const products = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.displayOn === "shop" || data.displayOn === "both") {
        products.push({ id: docSnap.id, ...data });
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
          <a href="product.html?id=${p.id}"><button class="btn">View</button></a>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load products:", err);
    grid.innerHTML = "<p style='color:red;'>Error loading products.</p>";
  }
}

loadProducts();

