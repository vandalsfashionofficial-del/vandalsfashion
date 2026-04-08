// custom-order.js
import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const profileContainer = document.getElementById("profileContainer");
const profilePic = document.getElementById("profile-Pic");
const authLink = document.getElementById("authLink");
const profileDropdown = document.getElementById("profileDropdown");

// ========== AUTH UI ==========
onAuthStateChanged(auth, (user) => {
  if (user && user.photoURL) {
    profilePic.src = user.photoURL;
    profileContainer.style.display = "block";
    authLink.style.display = "none";
  } else {
    profileContainer.style.display = "none";
    authLink.style.display = "inline-block";
  }
});

profilePic?.addEventListener("click", () => {
  profileDropdown.style.display =
    profileDropdown.style.display === "block" ? "none" : "block";
});

window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "auth.html";
  });
};

// ========== CUSTOM ORDER LOGIC ==========
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("customOrderForm");
  const loading = document.getElementById("loading");
  const imageInput = document.getElementById("referenceImage");
  const imagePreview = document.getElementById("imagePreview");

  // Show image previews
  imageInput?.addEventListener("change", () => {
    imagePreview.innerHTML = "";
    Array.from(imageInput.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.classList.add("preview-thumb");
        imagePreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });

  // Handle form submission
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    loading.style.display = "block";

    // Build order object
    const order = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      size: document.getElementById("size").value || "N/A",
      description: document.getElementById("description").value,
      images: [],
      type: "custom-order",
      timestamp: new Date().toISOString(),
      price: 0 // default price for custom orders
    };

    // Convert uploaded images to base64
    const files = imageInput.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
      order.images.push(dataUrl);
    }

    // Add to localStorage cart
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(order);
    localStorage.setItem("cart", JSON.stringify(cart));

    loading.style.display = "none";
    alert("Custom order added to cart! 🛒");

    // Reset form & preview
    form.reset();
    imagePreview.innerHTML = "";
  });
});
