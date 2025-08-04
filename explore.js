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

const exploreContainer = document.getElementById("exploreContainer");
const profilePic = document.getElementById("profilePic");
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

// 🔄 Load and group products by category
async function loadExploreProducts() {
  const productsByCategory = {};

  categories.forEach(cat => productsByCategory[cat] = []);

  try {
    const snapshot = await getDocs(collection(db, "products"));
    snapshot.forEach(doc => {
      const data = doc.data();
      if ((data.displayOn === "explore" || data.displayOn === "both") && categories.includes(data.category)) {
        productsByCategory[data.category].push({ ...data, id: doc.id });
      }
    });

    categories.forEach(cat => {
      const items = productsByCategory[cat];
      if (items.length > 0) {
        const section = document.createElement("section");
        section.className = "category-section";
        section.innerHTML = `
          <div class="category-banner">${cat}</div>
          <div class="product-grid">
            ${items.map(p => `
              <div class="product-card">
                <img src="${Array.isArray(p.imageUrls) ? p.imageUrls[0] : p.imageUrl}" alt="${p.name}" />
                <h3>${p.name}</h3>
                <p>₹${p.price}</p>
                <button onclick="location.href='product.html?id=${p.id}'">View</button>
              </div>
            `).join("")}
          </div>
        `;
        exploreContainer.appendChild(section);
      }
    });

  } catch (error) {
    console.error("Error loading explore products:", error);
    exploreContainer.innerHTML = "<p style='text-align:center; color:red;'>Error loading products.</p>";
  }
}

// 🔒 Auth
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

