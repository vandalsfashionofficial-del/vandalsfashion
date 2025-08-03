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

const imgbbAPIKey = "bbfd6eceec416726284963eb08f78632";

// 🔐 Restrict access
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

  const fileInput = document.getElementById("productImageFile");
  const imageFile = fileInput.files[0];

  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const category = document.getElementById("productCategory").value;
  const description = document.getElementById("productDescription").value.trim();
  const displayOn = document.getElementById("productTarget").value;

  if (!imageFile || !name || !price || !category || !description || !displayOn) {
    statusDiv.textContent = "❗ Please fill all fields and upload an image.";
    return;
  }

  statusDiv.textContent = "📤 Uploading image...";

  try {
    // Read file as base64
    const base64Image = await toBase64(imageFile);

    // Upload to imgbb
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
      method: "POST",
      body: new URLSearchParams({
        image: base64Image.split(',')[1]
      })
    });

    const result = await res.json();

    if (!result.success) throw new Error("Image upload failed.");

    const imageUrl = result.data.url;

    statusDiv.textContent = "⏳ Uploading product...";

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

    statusDiv.textContent = "✅ Product uploaded successfully!";
    form.reset();
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "❌ Upload failed.";
  }
});

// Helper: Convert file to base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

