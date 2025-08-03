// product.js
import { db } from './firebase-config.js';
import { doc, getDoc, addDoc, collection, Timestamp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const sizeSelect = document.getElementById("sizeSelect");
const customSizeFields = document.getElementById("customSizeFields");

sizeSelect.addEventListener("change", () => {
  customSizeFields.style.display = sizeSelect.value === "custom" ? "block" : "none";
});

async function loadProduct() {
  if (!productId) {
    alert("No product ID found in URL.");
    return;
  }

  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      alert("Product not found.");
      return;
    }

    const product = productSnap.data();
    productImage.src = product.imageUrl;
    productName.textContent = product.name;
    productPrice.textContent = `Price: ₹${product.price}`;
  } catch (err) {
    console.error("Error loading product:", err);
    alert("Failed to load product.");
  }
}

window.addToCart = () => {
  const size = sizeSelect.value;
  if (!size) return alert("Please select a size.");

  let custom = null;
  if (size === "custom") {
    const waist = document.getElementById("waist").value.trim();
    const hip = document.getElementById("hip").value.trim();
    const chest = document.getElementById("chest").value.trim();
    if (!waist || !hip || !chest) return alert("Fill in all custom size fields.");
    custom = { waist, hip, chest };
  }

  const colorPref = document.getElementById("colorChange").value.trim();
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cart.push({
    productId,
    name: productName.textContent,
    price: parseFloat(productPrice.textContent.replace(/[^\d.]/g, '')), // converts ₹1000 → 1000
    size,
    customSizes: custom,
    colorPreference: colorPref,
    imageUrl: productImage.src
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
  window.location.href = "cart.html"; // redirect to cart page
};


  const colorPref = document.getElementById("colorChange").value.trim();
  try {
    const orderData = {
      productId,
      productName: productName.textContent,
      productPrice: productPrice.textContent,
      size,
      customSizes: custom,
      colorPreference: colorPref,
      orderedAt: Timestamp.now()
    };

    await addDoc(collection(db, "orders"), orderData);
    alert("Order placed successfully!");
  } catch (err) {
    console.error("Order failed:", err);
    alert("Order failed. Try again.");
  }
};

loadProduct();
