// upload.js
import { auth, db } from './firebase-config.js';
import {
  collection,
  addDoc,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js';

// 🔐 Team-only Access
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

// 📤 Handle Upload
const form = document.getElementById("uploadForm");
const statusDiv = document.getElementById("uploadStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const imageUrl = document.getElementById("productImageUrl").value.trim();
  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const category = document.getElementById("productCategory").value;
  const description = document.getElementById("productDescription").value.trim();
  const displayOn = document.getElementById("productTarget").value;

  if (!imageUrl || !name || !price || !category || !description || !displayOn) {
    statusDiv.textContent = "❗ Please fill all fields.";
    return;
  }

  statusDiv.textContent = "Uploading...";

  try {
    const productData = {
      name,
      price,
      category,
      description,
      imageUrl, // ✅ No Firebase Storage, use direct link
      displayOn,
      createdAt: Timestamp.now()
    };

    await addDoc(collection(db, "products"), productData);
    statusDiv.textContent = "✅ Uploaded successfully!";
    form.reset();
  } catch (err) {
    console.error("Upload error:", err);
    statusDiv.textContent = "❌ Upload failed.";
  }
});

