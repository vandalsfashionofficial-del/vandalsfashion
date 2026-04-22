import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tckvbedfkidouvcltxci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRja3ZiZWRma2lkb3V2Y2x0eGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDI1ODksImV4cCI6MjA5MjA3ODU4OX0.ADrsPheVPnns-_Iclx6QueJt76D3hzvo16Xdv_9-77k"
);
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js';

const imgbbAPIKey = "bbfd6eceec416726284963eb08f78632";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login first.");
    window.location.href = "auth.html";
    return;
  }

  const allowed = ["vandalsfashionofficial@gmail.com", "arjunbtskimm123098@gmail.com"];
  if (!allowed.includes(user.email)) {
    alert("Not authorized.");
    signOut(auth).then(() => (window.location.href = "auth.html"));
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => (window.location.href = "auth.html"));
});

const form = document.getElementById("uploadForm");
const statusDiv = document.getElementById("uploadStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const files = document.getElementById("productImageFile").files;
  if (files.length === 0) {
    statusDiv.textContent = "❗ Please select at least one image.";
    return;
  }

  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const category = document.getElementById("productCategory").value;
  const description = document.getElementById("productDescription").value.trim();
  const displayOn = document.getElementById("productTarget").value;

  if (!name || !price || !category || !description || !displayOn) {
    statusDiv.textContent = "❗ Please fill all fields.";
    return;
  }

  try {
    statusDiv.textContent = "📤 Uploading images...";

    const imageUrls = [];

    for (let file of files) {
      const base64 = await toBase64(file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: "POST",
        body: new URLSearchParams({
          image: base64.split(',')[1]
        })
      });

      const result = await res.json();
      if (!result.success) throw new Error("One or more images failed to upload.");
      imageUrls.push(result.data.url);
    }

    statusDiv.textContent = "⏳ Uploading product data...";

     console.log("SENDING TO SUPABASE:", {
  name,
  price,
  category,
  description,
  image_url: imageUrls[0]
});
    const { data, error } = await supabase
  .from("products")
  .insert([
    {
      name,
      price,
      category,
      description,
      image_url: imageUrls[0],
      is_sold: false
    }
  ])
   
  .select(); // 👈 VERY IMPORTANT
console.log("INSERT RESPONSE FULL:", JSON.stringify({ data, error }, null, 2));
  
    if (error) {
  console.error("SUPABASE ERROR:", error);
  statusDiv.textContent = "❌ Upload failed: " + error.message;
  return;
}
 if (!data || data.length === 0) {
  statusDiv.textContent = "❌ Insert returned empty!";
  console.warn("No rows inserted!");
  return;
}
    statusDiv.textContent = "✅ Product uploaded successfully!";
    form.reset();
} catch (err) {
  console.error("FULL ERROR:", err);
  statusDiv.textContent = "❌ " + err.message;
}
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}


