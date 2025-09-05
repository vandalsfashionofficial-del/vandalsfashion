import { auth, db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const grid = document.getElementById('productGrid');
const profilePic = document.getElementById("profile-Pic");
const authLink = document.getElementById("authLink");
const userDropdown = document.getElementById("userDropdown");

// ✅ Get category from URL (e.g., ?category=Trendy)
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get("category");

// Optional: Show heading
if (selectedCategory) {
  const heading = document.createElement("h2");
  heading.textContent = `Showing: ${selectedCategory}`;
  heading.style.textAlign = "center";
  heading.style.margin = "20px 0";
  grid.before(heading);
}

// 🔐 Profile UI
onAuthStateChanged(auth, (user) => {
  if (user && user.photoURL) {
    profilePic.src = user.photoURL;
    profilePic.style.display = "inline-block";
    authLink.style.display = "none";
  }
});

profile-Pic?.addEventListener("click", () => {
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
      const showOnShop = data.displayOn === "shop" || data.displayOn === "both";
      const matchesCategory = !selectedCategory || data.category === selectedCategory;

      if (showOnShop && matchesCategory) {
        products.push({ id: docSnap.id, ...data });
      }
    });

    if (products.length === 0) {
      grid.innerHTML = "<p style='text-align:center; color:#888;'>No products found in this category.</p>";
      return;
    }

    grid.innerHTML = "";
    products.forEach(p => {
      const imageUrl = Array.isArray(p.imageUrls) && p.imageUrls.length > 0
        ? p.imageUrls[0]
        : (p.imageUrl || "placeholder.jpg"); // fallback

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${imageUrl}" alt="${p.name}">
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
