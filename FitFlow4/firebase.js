// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCBfNp7zmYXt1xJqfD42NPCMijgH7Se0ho",
    authDomain: "fitflow3-88863.firebaseapp.com",
    projectId: "fitflow3-88863",
    storageBucket: "fitflow3-88863.appspot.com",  // typo fixed here: `.app` ➝ `.appspot.com`
    messagingSenderId: "901588034499",
    appId: "1:901588034499:web:9f2a24548dda53c093d376",
    measurementId: "G-N13GHE067H"
  };

const app = initializeApp(firebaseConfig); // 👈 This is important!
const auth = getAuth(app); // 👈 use the app here

export { auth };
