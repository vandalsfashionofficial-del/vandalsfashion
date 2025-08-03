// explore.js
import { db } from './firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';

const productGrid = document.getElementById('exploreProducts');

async function loadExploreProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
      const product = doc.data();

      // Only show products marked for "explore" or "both"
      if (product.displayOn === "explore" || product.displayOn === "both") {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
          <img src="${product.imageUrl}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
        `;

        productGrid.appendChild(card);
      }
    });
  } catch (error) {
    console.error("Error loading explore products:", error);
  }
}

loadExploreProducts();
