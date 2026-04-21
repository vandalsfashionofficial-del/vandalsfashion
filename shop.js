import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tckvbedfkidouvcltxci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRja3ZiZWRma2lkb3V2Y2x0eGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDI1ODksImV4cCI6MjA5MjA3ODU4OX0.ADrsPheVPnns-_Iclx6QueJt76D3hzvo16Xdv_9-77k"
);
import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const grid = document.getElementById('productGrid');
const profileContainer = document.getElementById("profileContainer");
const profilePic = document.getElementById("profile-Pic");
const profileDropdown = document.getElementById("profileDropdown");
const authLink = document.getElementById("authLink");

// ✅ Get category from URL (e.g., ?category=Trendy)
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get("category");

// Optional: Show heading
if (selectedCategory) {
  const heading = document.createElement("h2");
  heading.textContent = `Showing: ${selectedCategory}`;
  heading.style.textAlign = "center";
  heading.style.margin = "20px 0";
  grid.before(heading);
}

// 🔐 Profile UI
onAuthStateChanged(auth, (user) => {
  if (user && user.photoURL) {
    profileContainer.style.display = "block";   // show profile section
    profilePic.src = user.photoURL;
    authLink.style.display = "none";            // hide login
  } else {
    profileContainer.style.display = "none";    // hide profile
    authLink.style.display = "inline-block";    // show login
  }
});


profilePic?.addEventListener("click", () => {
  profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
});

window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "auth.html";
  });
};

// 🔄 Load Shop Products
async function loadProducts() {
  try {
    const { data, error } = await supabase
  .from("products")
  .select("*")
  .eq("is_sold", false);

if (error) throw error;
   const products = data;

    if (products.length === 0) {
      grid.innerHTML = "<p style='text-align:center; color:#888;'>No products found in this category.</p>";
      return;
    }

    grid.innerHTML = "";
   products
  .filter(p => !selectedCategory || p.category === selectedCategory)
  .forEach(p => {
      const imageUrl = Array.isArray(p.imageUrls) && p.imageUrls.length > 0
        ? p.imageUrls[0]
        : (p.imageUrl || "placeholder.jpg"); // fallback

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${imageUrl}" alt="${p.name}">
        <div class="card-content">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
          <a href="product.html?id=${p.id}"><button class="btn">View</button></a>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load products:", err);
    grid.innerHTML = "<p style='color:red;'>Error loading products.</p>";
  }
}

loadProducts();
// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (
    profileDropdown &&
    profilePic &&
    !profileDropdown.contains(e.target) &&
    !profilePic.contains(e.target)
  ) {
    profileDropdown.style.display = "none";
  }
});
