// // import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
// // auth.js
// import { auth } from './firebase.js';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged
// } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";


// // const auth = getAuth();

// window.signup = function () {
//   const email = document.getElementById("loginEmail").value;
//   const password = document.getElementById("loginPassword").value;

//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       document.getElementById("status").innerText = "Signup successful!";
//     })
//     .catch((error) => {
//       document.getElementById("status").innerText = "Signup error: " + error.message;
//     });
// };

// window.login = function () {
//   const email = document.getElementById("loginEmail").value;
//   const password = document.getElementById("loginPassword").value;

//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       document.getElementById("status").innerText = "Login successful!";
//     })
//     .catch((error) => {
//       document.getElementById("status").innerText = "Login error: " + error.message;
//     });
// };

// window.onload = () => {
//   const dashboard = document.getElementById("dashboard");
//   const authSection = document.getElementById("authSection");
//   const loginBtn = document.getElementById("loginBtn");
//   const logoutBtn = document.getElementById("logoutBtn");

//   document.getElementById("loginBtn").addEventListener("click", () => {
//     dashboard.style.display = "none";
//     authSection.style.display = "block";
//   });

//   logoutBtn.addEventListener("click", () => {
//     signOut(auth).then(() => {
//       authSection.style.display = "block";
//       dashboard.style.display = "none";
//       loginBtn.style.display = "block";
//       logoutBtn.style.display = "none";
//     });
//   });

//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       authSection.style.display = "none";
//       dashboard.style.display = "block";
//       loginBtn.style.display = "none";
//       logoutBtn.style.display = "block";
//       document.getElementById("welcomeMessage").innerText = `Welcome, ${user.email.split('@')[0]}!`;
//     } else {
//       authSection.style.display = "block";
//       dashboard.style.display = "none";
//       loginBtn.style.display = "block";
//       logoutBtn.style.display = "none";
//     }
//   });
// };

// // Login
// function login() {
//   const email = document.getElementById('loginEmail').value;
//   const password = document.getElementById('loginPassword').value;

//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       document.getElementById("status").innerText = `Logged in as ${user.email}`;
//       document.getElementById("authSection").style.display = "none";
//       document.getElementById("logoutBtn").style.display = "inline-block";
//     })
//     .catch((error) => {
//       document.getElementById("status").innerText = error.message;
//     });
// }

// // Signup
// function signup() {
//   const email = document.getElementById('loginEmail').value;
//   const password = document.getElementById('loginPassword').value;

//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       document.getElementById("status").innerText = `Account created for ${user.email}`;
//     })
//     .catch((error) => {
//       document.getElementById("status").innerText = error.message;
//     });
// }

// // Logout
// function logout() {
//   signOut(auth)
//     .then(() => {
//       document.getElementById("status").innerText = "Logged out";
//       document.getElementById("authSection").style.display = "block";
//       document.getElementById("logoutBtn").style.display = "none";
//     })
//     .catch((error) => {
//       document.getElementById("status").innerText = error.message;
//     });
// }

// window.login = login;
// window.signup = signup;
// window.logout = logout;

import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Reference to the content wrapper and login/logout buttons
const contentWrapper = document.getElementById("contentWrapper");
const authSection = document.getElementById("authSection");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

window.signup = function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      document.getElementById("status").innerText = "Signup successful!";
    })
    .catch((error) => {
      document.getElementById("status").innerText = "Signup error: " + error.message;
    });
};

window.login = function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      document.getElementById("status").innerText = "Login successful!";
    })
    .catch((error) => {
      document.getElementById("status").innerText = "Invalid Credentials!";
    });
};

window.onload = () => {
  // Toggle visibility for login/logout buttons and sections based on user auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in, hide login section and show content
      authSection.style.display = "none";
      contentWrapper.style.display = "block";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";

      // Show welcome message
      document.getElementById("welcomeMessage").innerText = `Welcome, ${user.email.split('@')[0]}!`;
    } else {
      // User is logged out, show login section
      authSection.style.display = "block";
      contentWrapper.style.display = "none";
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
    }
  });

  // Login button click - Show login section and hide content
  loginBtn.addEventListener("click", () => {
    authSection.style.display = "block";
    contentWrapper.style.display = "none";
  });

  // Logout button click - Log out and show login section
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      authSection.style.display = "block";
      contentWrapper.style.display = "none";
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
    });
  });
};
