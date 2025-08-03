import { auth, db, storage } from './firebase-config.js';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import {
  collection,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// 🔐 Access Control
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

// 📤 Handle Form
const form = document.getElementById("uploadForm");
const statusDiv = document.getElementById("uploadStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const displayOn = document.getElementById("productTarget").value;
  const imageFile = document.getElementById("productImage").files[0];
  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const category = document.getElementById("productCategory").value;
  const description = document.getElementById("productDescription").value.trim();

  if (!imageFile || !name || !price || !category || !description) {
    statusDiv.textContent = "❗ Fill all fields.";
    return;
  }

  statusDiv.textContent = "Uploading...";

  try {
    const storagePath = `products/${Date.now()}_${imageFile.name}`;
    const imageRef = ref(storage, storagePath); // ✅ FIXED error source
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    const productData = {
      name,
      price,
      category,
      description,
      imageUrl,
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
