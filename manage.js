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

onAuthStateChanged(auth, async (user) => {
  if (!user || !allowedEmails.includes(user.email)) {
    alert("Access denied.");
    window.location.href = "auth.html";
    return;
  }

  await loadProducts();
});

async function loadProducts() {
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
        <img src="${data.imageUrl}" alt="${data.name}">
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
          await deleteDoc(doc(db, "products", id));
          btn.parentElement.remove();
          alert("Deleted.");
        }
      });
    });

  } catch (err) {
    console.error("Load error:", err);
    grid.innerHTML = "<p>Error loading products.</p>";
  }
}
