// secure-login.js

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('authOverlay');
  const loginForm = document.getElementById('authForm');

  const allowedEmails = [
    "arjunbtskimm123098@gmail.com",
    "vandalsfashionofficial@gmail.com"
  ];
  const allowedPassword = "specialindicatedsite45";

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('authEmail').value.trim();
    const passwordInput = document.getElementById('authPassword').value.trim();

    if (allowedEmails.includes(emailInput) && passwordInput === allowedPassword) {
      overlay.style.display = 'none';
      document.body.classList.remove('blurred');
    } else {
      alert("Access denied: Wrong credentials.");
    }
  });
});
