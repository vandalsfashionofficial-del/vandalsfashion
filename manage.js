// manage.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { auth } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const supabase = createClient(
  "https://tckvbedfkidouvcltxci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRja3ZiZWRma2lkb3V2Y2x0eGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDI1ODksImV4cCI6MjA5MjA3ODU4OX0.ADrsPheVPnns-_Iclx6QueJt76D3hzvo16Xdv_9-77k"
);

// 🛡️ Team-only Access
const allowedEmails = [
  "vandalsfashionofficial@gmail.com",
  "arjunbtskimm123098@gmail.com"
];

const grid = document.getElementById("productGrid");

// ✅ Wait for localStorage authentication too
const checkOverlayAuth = () => {
  const isAuth = localStorage.getItem("vf_auth") === "true";
  if (!isAuth) {
    document.getElementById("authOverlay").style.display = "flex";
    return false;
  } else {
    document.getElementById("authOverlay").style.display = "none";
    return true;
  }
};

onAuthStateChanged(auth, async (user) => {
  if (!user || !allowedEmails.includes(user.email)) {
    console.warn("AuthState: Access denied or no user.");
    return;
  }

  const overlayPassed = checkOverlayAuth();
  if (!overlayPassed) return;

  await loadProducts();
});

async function loadProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_sold", false);

    if (error) throw error;

    if (!data || data.length === 0) {
      grid.innerHTML = "<p>No products found.</p>";
      return;
    }

    grid.innerHTML = "";

    data.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <p style="font-size: 0.85rem; color: #666;">${product.description || "No description"}</p>
        <button class="delete-btn" data-id="${product.id}">Delete</button>
      `;
      grid.appendChild(card);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Delete this product?")) {
          try {
            console.log("Deleting product with ID:", id);
            
            const { error } = await supabase
              .from("products")
              .delete()
              .eq("id", id);

            console.log("Delete error:", error);

            if (error) {
              console.error("Delete error details:", error);
              throw error;
            }

            btn.parentElement.remove();
            alert("Product deleted successfully!");
            
            // Reload to verify deletion from database
            setTimeout(() => {
              window.location.reload();
            }, 500);
          } catch (e) {
            console.error("Delete failed:", e);
            alert("Delete failed: " + (e.message || "Unknown error"));
          }
        }
      });
    });

  } catch (err) {
    console.error("Load error:", err);
    grid.innerHTML = "<p>Error loading products.</p>";
  }
}
