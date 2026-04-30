// custom-order.js
import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

 async function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 800;
      const scaleSize = MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", 0.7); // 👈 quality (0.7 = perfect balance)
    };

    reader.readAsDataURL(file);
  });
}

async function uploadToCloudinary(file) {
  const url = "https://api.cloudinary.com/v1_1/ddxivdsgb/image/upload";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "vandals_upload");

  const res = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.secure_url;
}

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
    
  const files = imageInput.files;

  // ✅ validation
  if (files.length === 0) {
    alert("Please upload at least 1 image");
    loading.style.display = "none";
    return;
  }

  if (files.length > 2) {
    alert("Max 2 images allowed");
    loading.style.display = "none";
    return;
  }

  // ✅ Build order object
  const order = {
  productName: document.getElementById("productName").value,
  phone: document.getElementById("phone").value,
  size: document.getElementById("size").value || "N/A",
  description: document.getElementById("description").value,
  images: [],
  type: "custom-order",
  timestamp: new Date().toISOString(),
  price: 0
};

  // 🔥 Upload images to Cloudinary
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

   
    
    const compressedFile = await compressImage(file);
const imageUrl = await uploadToCloudinary(compressedFile);
    order.images.push(imageUrl);
  }

  // ✅ Save to cart
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push(order);
  localStorage.setItem("cart", JSON.stringify(cart));

  loading.style.display = "none";
  alert("Custom order added to cart! 🛒");

  // reset
  form.reset();
  imagePreview.innerHTML = "";
});
});
