// ✅ Use your shared firebase-config.js
import { db, auth } from './firebase-config.js';
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// DOM
const productListDiv = document.getElementById("productGrid");

// 👨‍💻 Team-only check
const allowedEmails = [
  "vandalsfashionofficial@gmail.com",
  "arjunbtskimm123098@gmail.com"
];

onAuthStateChanged(auth, async (user) => {
  if (user && allowedEmails.includes(user.email)) {
    await loadProducts();
  } else {
    productListDiv.innerHTML = "<p>Access Denied. Team only.</p>";
  }
});

async function loadProducts() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    productListDiv.innerHTML = "";

    if (snapshot.empty) {
      productListDiv.innerHTML = "<p>No products found.</p>";
      return;
    }

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
      productListDiv.appendChild(card);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const productId = btn.getAttribute("data-id");
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
          await deleteDoc(doc(db, "products", productId));
          btn.parentElement.remove();
          alert("Product deleted.");
        } catch (err) {
          console.error("Delete error:", err);
          alert("Failed to delete.");
        }
      });
    });
  } catch (error) {
    console.error("Load error:", error);
    productListDiv.innerHTML = "<p>Error loading products.</p>";
  }
}
