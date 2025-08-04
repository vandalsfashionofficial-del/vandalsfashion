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

    const productData = {
      name,
      price,
      category,
      description,
      imageUrls,
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

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}


