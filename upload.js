import { auth, db, storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';
import { collection, addDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// ✅ Team-only access check
onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Access restricted. Please login first.");
    window.location.href = 'auth.html';
    return;
  }

  const allowedEmails = [
    'vandalsfashionofficial@gmail.com',
    'arjunbtskimm123098@gmail.com'
  ];

  if (!allowedEmails.includes(user.email)) {
    alert("You are not authorized to access this page.");
    signOut(auth).then(() => window.location.href = 'auth.html');
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => window.location.href = 'auth.html');
});

const form = document.getElementById('uploadForm');
const statusDiv = document.getElementById('uploadStatus');

form.addEventListener('submit', async (e) => {
  const displayOn = document.getElementById('productTarget').value;

  e.preventDefault();

  const imageFile = document.getElementById('productImage').files[0];
  const name = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value);
  const category = document.getElementById('productCategory').value;
  const description = document.getElementById('productDescription').value.trim();

  if (!imageFile || !name || !price || !category || !description) {
    statusDiv.textContent = 'Please fill all fields.';
    return;
  }

  statusDiv.textContent = 'Uploading image...';

  try {
    const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

  const productData = {
  name,
  price,
  category,
  description,
  imageUrl,
  displayOn, // 🎯 this line adds the target (shop/explore/both)
  createdAt: Timestamp.now()
};

    await addDoc(collection(db, 'products'), productData);
    statusDiv.textContent = '✅ Product uploaded successfully!';
    form.reset();
  } catch (err) {
    console.error(err);
    statusDiv.textContent = '❌ Upload failed. Try again.';
  }
});
