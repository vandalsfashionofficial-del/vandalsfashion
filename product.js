// product.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tckvbedfkidouvcltxci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRja3ZiZWRma2lkb3V2Y2x0eGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDI1ODksImV4cCI6MjA5MjA3ODU4OX0.ADrsPheVPnns-_Iclx6QueJt76D3hzvo16Xdv_9-77k"
);

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const sizeSelect = document.getElementById("sizeSelect");
const customSizeFields = document.getElementById("customSizeFields");
const gallery = document.getElementById("thumbnailRow");

let stock = 1; // Default stock value
let quantity = 1;

sizeSelect.addEventListener("change", () => {
  customSizeFields.style.display = sizeSelect.value === "custom" ? "block" : "none";
});

async function loadProduct() {
  if (!productId) {
    alert("No product ID found in URL.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error || !data) {
      alert("Product not found.");
      return;
    }

    const product = data;
    stock = product.stock || 1; // Get stock from product

    // Handle image (Supabase uses image_url)
    const images = product.image_urls || [product.image_url];

    productImage.src = images[0];
    productImage.setAttribute("data-url", images[0]);

    productName.textContent = product.name;
    productPrice.textContent = `Price: ₹${product.price}`;

    // Thumbnails (same as before)
    if (gallery) {
      gallery.innerHTML = "";
      images.forEach((url, idx) => {
        const thumb = document.createElement("img");
        thumb.src = url;
        if (idx === 0) thumb.classList.add("active");

        thumb.addEventListener("click", () => {
          productImage.src = url;
          productImage.setAttribute("data-url", url);

          document.querySelectorAll("#thumbnailRow img")
            .forEach(t => t.classList.remove("active"));

          thumb.classList.add("active");
        });

        gallery.appendChild(thumb);
      });
    }

    // Initialize quantity UI after product loads
    updateQtyUI();

  } catch (err) {
    console.error("Error loading product:", err);
    alert("Failed to load product.");
  }
}

function updateQtyUI() {
  const plusBtn = document.querySelector('.qty-container button:nth-child(3)');
  const minusBtn = document.querySelector('.qty-container button:nth-child(1)');
  const qtyDisplay = document.getElementById("qty");

  qtyDisplay.textContent = quantity;

  // Disable minus if quantity is 1
  minusBtn.disabled = quantity <= 1;
  minusBtn.style.opacity = quantity <= 1 ? "0.5" : "1";

  // Disable plus if quantity equals stock
  plusBtn.disabled = quantity >= stock;
  plusBtn.style.opacity = quantity >= stock ? "0.5" : "1";
}

window.changeQty = (change) => {
  if (change > 0 && quantity >= stock) {
    return; // Don't increase if we're at stock limit
  }
  if (change < 0 && quantity <= 1) {
    return; // Don't decrease below 1
  }

  quantity += change;
  updateQtyUI();
};

window.addToCart = async () => {
  const size = sizeSelect.value;
  if (!size) return alert("Please select a size.");

  // Check if enough stock available
  if (quantity > stock) {
    alert("Not enough stock available!");
    return;
  }

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
    colorPreference: colorPref,
    quantity: parseInt(quantity) || 1
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  // Update local stock
 stock = Math.max(0, stock - quantity);
  quantity = 1;
  updateQtyUI();

  alert("Added to cart!");
  window.location.href = "cart.html";
};


loadProduct();