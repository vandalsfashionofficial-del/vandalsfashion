// product.js
import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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
    productPrice.textContent = Price: ₹${product.price};
    productImage.setAttribute("data-url", product.imageUrl); // for cart
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
    id: productId,
    name: productName.textContent,
    price: parseInt(productPrice.textContent.replace("Price: ₹", "")),
    imageUrl: productImage.getAttribute("data-url"),
    size,
    custom,
    colorPreference: colorPref
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
  window.location.href = "cart.html";
};

loadProduct();


