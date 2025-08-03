import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const mainImage = document.getElementById("mainImage");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const sizeSelect = document.getElementById("sizeSelect");
const customSizeFields = document.getElementById("customSizeFields");
const thumbnailRow = document.getElementById("thumbnailRow");

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
    const images = product.imageUrls || [product.imageUrl];

    productName.textContent = product.name;
    productPrice.textContent = `Price: ₹${product.price}`;
    mainImage.src = images[0];

    images.forEach((url, idx) => {
      const thumb = document.createElement("img");
      thumb.src = url;
      if (idx === 0) thumb.classList.add("active");
      thumb.addEventListener("click", () => {
        mainImage.src = url;
        document.querySelectorAll("#thumbnailRow img").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
      });
      thumbnailRow.appendChild(thumb);
    });
  } catch (err) {
    console.error("Error loading product:", err);
    alert("Failed to load product.");
  }
}

loadProduct();

