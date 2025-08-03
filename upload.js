import { auth, db } from './firebase-config.js';
import {
  collection, addDoc, Timestamp
} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
import {
  onAuthStateChanged, signOut
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

  const fileInput = document.getElementById("productImageFile");
  const imageFiles = fileInput.files;

  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const category = document.getElementById("productCategory").value;
  const description = document.getElementById("productDescription").value.trim();
  const displayOn = document.getElementById("productTarget").value;

  if (imageFiles.length === 0 || !name || !price || !category || !description || !displayOn) {
    statusDiv.textContent = "❗ Please fill all fields and upload at least 1 image.";
    return;
  }

  statusDiv.textContent = "📤 Uploading images...";

  try {
    const imageUrls = [];

    for (const imageFile of imageFiles) {
      const base64Image = await toBase64(imageFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: "POST",
        body: new URLSearchParams({
          image: base64Image.split(',')[1]
        })
      });

      const result = await res.json();
      if (!result.success) throw new Error("Image upload failed.");
      imageUrls.push(result.data.url);
    }

    statusDiv.textContent = "⏳ Uploading product...";

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
    reader.onerror = error => reject(error);
  });
}

  });
}

