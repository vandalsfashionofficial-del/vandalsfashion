// manage.js
import { db, auth } from './firebase-config.js';
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// 🛡️ Team-only Access
const allowedEmails = [
  "vandalsfashionofficial@gmail.com",
  "arjunbtskimm123098@gmail.com"
];

const grid = document.getElementById("productGrid");

// ✅ Wait for localStorage authentication too
const checkOverlayAuth = () => {
  const isAuth = localStorage.getItem("vf_auth") === "true";
  if (!isAuth) {
    document.getElementById("authOverlay").style.display = "flex";
    return false;
  } else {
    document.getElementById("authOverlay").style.display = "none";
    return true;
  }
};

onAuthStateChanged(auth, async (user) => {
  if (!user || !allowedEmails.includes(user.email)) {
    console.warn("AuthState: Access denied or no user.");
    return;
  }

  const overlayPassed = checkOverlayAuth();
  if (!overlayPassed) return;

  await loadProducts();
});

async function loadProducts() {
  try {
    const colRef = collection(db, "products");
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      grid.innerHTML = "<p>No products found.</p>";
      return;
    }

    grid.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.name}">
        <h3>${data.name}</h3>
        <p>₹${data.price}</p>
        <p style="font-size: 0.85rem; color: #666;">${data.description || "Estimated delivery: 15–20 days. International shipping may take an additional 15–20 days."}</p>
        <button class="delete-btn" data-id="${docSnap.id}">Delete</button>
      `;
      grid.appendChild(card);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Delete this product?")) {
          try {
            await deleteDoc(doc(db, "products", id));
            btn.parentElement.remove();
            alert("Deleted.");
          } catch (e) {
            console.error("Delete failed:", e);
            alert("Delete failed. Try again.");
          }
        }
      });
    });

  } catch (err) {
    console.error("Load error:", err);
    grid.innerHTML = "<p>Error loading products.</p>";
  }
}
