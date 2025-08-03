// ✅ FINAL manage.js (Updated for imgbb hosted images)

import { auth, db } from './firebase-config.js';
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const grid = document.getElementById("productGrid");
const allowedEmails = [
  "vandalsfashionofficial@gmail.com",
  "arjunbtskimm123098@gmail.com"
];

onAuthStateChanged(auth, async (user) => {
  if (!user || !allowedEmails.includes(user.email)) {
    alert("Access denied. Admins only.");
    window.location.href = "auth.html";
    return;
  }

  loadProducts();
});

async function loadProducts() {
  grid.innerHTML = "<p>Loading...</p>";
  try {
    const snapshot = await getDocs(collection(db, "products"));
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
        <img src="${data.imageUrl}" alt="${data.name}" />
        <h3>${data.name}</h3>
        <p>₹${data.price}</p>
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
            alert("Product deleted.");
          } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete.");
          }
        }
      });
    });
  } catch (err) {
    console.error("Load error:", err);
    grid.innerHTML = "<p>Error loading products.</p>";
  }
}
