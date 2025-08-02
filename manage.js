import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, getDocs, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref as storageRef, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const allowedEmails = [
  "vandalsfashionofficial@gmail.com",
  "arjunbtskimm123098@gmail.com"
];

const productListDiv = document.getElementById("productList");
const statusDiv = document.getElementById("status");

onAuthStateChanged(auth, async (user) => {
  if (user && allowedEmails.includes(user.email)) {
    statusDiv.textContent = `Logged in as ${user.email}`;
    await loadProducts();
  } else {
    statusDiv.textContent = "Access denied. Admins only.";
    productListDiv.innerHTML = "";
  }
});

async function loadProducts() {
  productListDiv.innerHTML = "Loading products...";

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
        <button class="delete-btn" data-id="${docSnap.id}" data-url="${data.imageUrl}">Delete</button>
      `;
      productListDiv.appendChild(card);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const productId = btn.getAttribute("data-id");
        const imageUrl = btn.getAttribute("data-url");
        const confirmDelete = confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
          await deleteDoc(doc(db, "products", productId));

          const pathStart = imageUrl.indexOf("/o/") + 3;
          const pathEnd = imageUrl.indexOf("?alt=");
          const filePath = decodeURIComponent(imageUrl.substring(pathStart, pathEnd));

          const imageRef = storageRef(storage, filePath);
          await deleteObject(imageRef);

          btn.parentElement.remove();
          alert("Product deleted.");
        } catch (err) {
          console.error("Error deleting:", err);
          alert("Failed to delete product.");
        }
      });
    });
  } catch (error) {
    console.error("Failed to load products:", error);
    productListDiv.innerHTML = "Error loading products.";
  }
}
