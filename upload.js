import { auth, db } from './firebase-config.js';
import { collection, addDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js';

const imgbbAPIKey = "bbfd6eceec416726284963eb08f78632";
const allowedAdmins = ["vandalsfashionofficial@gmail.com", "arjunbtskimm123098@gmail.com"];

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login first.");
    window.location.href = "auth.html";
    return;
  }

  if (!allowedAdmins.includes(user.email)) {
    alert("Not authorized.");
    signOut(auth).then(() => window.location.href = "auth.html");
  }
});

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const category = document.getElementById("productCategory").value;
  const description = document.getElementById("productDescription").value.trim();
  const displayOn = document.getElementById("productTarget").value;
  const imageFiles = document.getElementById("productImageFiles").files;
  const statusDiv = document.getElementById("uploadStatus");

  if (!imageFiles.length || !name || !price || !category || !description || !displayOn) {
    statusDiv.textContent = "❗ Please fill all fields and upload images.";
    return;
  }

  statusDiv.textContent = "📤 Uploading images...";

  try {
    const imageUrls = [];
    for (const file of imageFiles) {
      const base64 = await toBase64(file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: "POST",
        body: new URLSearchParams({ image: base64.split(',')[1] })
      });

      const result = await res.json();
      if (!result.success) throw new Error("Image upload failed");
      imageUrls.push(result.data.url);
    }

    statusDiv.textContent = "⏳ Saving product...";

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
    document.getElementById("uploadForm").reset();
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "❌ Upload failed. Please try again.";
  }
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}



  });
}

