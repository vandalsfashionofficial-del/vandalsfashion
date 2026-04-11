import { auth } from "./firebase-config.js";
import {
GoogleAuthProvider,
signInWithPopup,
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

window.signup = async function(){

const username=document.getElementById("signupUsername").value.trim();
const email=document.getElementById("signupEmail").value.trim();
const password=document.getElementById("signupPassword").value;

if(!username || !email || !password){
alert("Please fill in all signup fields.");
return;
}

try{

const result=await createUserWithEmailAndPassword(auth,email,password);
const user=result.user;

localStorage.setItem("vf_username",username);
localStorage.setItem("vf_user_email",email);
localStorage.setItem("vf_user_uid",user.uid);

localStorage.setItem("vf_user",JSON.stringify({
username,
email,
uid:user.uid,
google:false
}));

const redirectUrl=localStorage.getItem("vf_redirect_after_login") || "index.html";

  
localStorage.setItem("vf_just_logged_in", "true");
const existing = localStorage.getItem("vf_user_details");
const justLoggedIn = localStorage.getItem("vf_just_logged_in");

if (!existing && justLoggedIn === "true") {
  document.getElementById("addressModal").classList.remove("hidden");
  localStorage.removeItem("vf_just_logged_in");
} else {
  window.location.href = redirectUrl;
}

}catch(error){
alert("Signup failed: "+error.message);
}

};

window.login = async function(){

const email=document.getElementById("loginEmail").value.trim();
const password=document.getElementById("loginPassword").value;

if(!email || !password){
alert("Please enter email and password.");
return;
}

try{

const result=await signInWithEmailAndPassword(auth,email,password);
const user=result.user;

localStorage.setItem("vf_username", email.split("@")[0]); // ADD THIS
localStorage.setItem("vf_user_email",email);
localStorage.setItem("vf_user_uid",user.uid);
localStorage.setItem("vf_user_photo", "");
  
localStorage.setItem("vf_user",JSON.stringify({
email,
uid:user.uid,
google:false
}));

const redirectUrl=localStorage.getItem("vf_redirect_after_login") || "index.html";


localStorage.setItem("vf_just_logged_in", "true");
const existing = localStorage.getItem("vf_user_details");
const justLoggedIn = localStorage.getItem("vf_just_logged_in");

if (!existing && justLoggedIn === "true") {
  document.getElementById("addressModal").classList.remove("hidden");
  localStorage.removeItem("vf_just_logged_in");
} else {
  window.location.href = redirectUrl;
}

}catch(error){
alert("Login failed: "+error.message);
}

};

window.googleSignIn = async function(){

try{

const result=await signInWithPopup(auth,provider);
const user=result.user;

localStorage.setItem("vf_username",user.displayName);
localStorage.setItem("vf_user_email",user.email);
localStorage.setItem("vf_user_uid",user.uid);
localStorage.setItem("vf_user_photo",user.photoURL);

localStorage.setItem("vf_user",JSON.stringify({
username:user.displayName,
email:user.email,
uid:user.uid,
google:true,
photo:user.photoURL
}));

const redirectUrl=localStorage.getItem("vf_redirect_after_login") || "index.html";


localStorage.setItem("vf_just_logged_in", "true");
const existing = localStorage.getItem("vf_user_details");
const justLoggedIn = localStorage.getItem("vf_just_logged_in");

if (!existing && justLoggedIn === "true") {
  document.getElementById("addressModal").classList.remove("hidden");
  localStorage.removeItem("vf_just_logged_in");
} else {
  window.location.href = redirectUrl;
}

}catch(error){
alert("Google Sign-In failed: "+error.message);
}

};

window.showSignup=function(){
document.getElementById("signupForm").classList.remove("hidden");
document.getElementById("loginForm").classList.add("hidden");
document.getElementById("formTitle").innerText="Sign Up";
};

window.showLogin=function(){
document.getElementById("signupForm").classList.add("hidden");
document.getElementById("loginForm").classList.remove("hidden");
document.getElementById("formTitle").innerText="Login";
};
window.saveUserDetails = function() {
  const name = document.getElementById("modalName").value.trim();
  const phone = document.getElementById("modalPhone").value.trim();
  const address = document.getElementById("modalAddress").value.trim();
  const pincode = document.getElementById("modalPincode").value.trim();

  if (!name || !phone || !address || !pincode) {
    alert("Fill all details");
    return;
  }

  const userDetails = {
    name,
    phone,
    address,
    pincode
  };

  localStorage.setItem("vf_user_details", JSON.stringify(userDetails));

  const redirectUrl = localStorage.getItem("vf_redirect_after_login") || "index.html";
  localStorage.removeItem("vf_redirect_after_login");

  window.location.href = redirectUrl;
};
