// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLS-4XMHhVDW2v7JnJOcLxlSQsIjmZ_98",
  authDomain: "loan-management-platform-750c5.firebaseapp.com",
  projectId: "loan-management-platform-750c5",
  storageBucket: "loan-management-platform-750c5.firebasestorage.app",
  messagingSenderId: "793243869839",
  appId: "1:793243869839:web:767150de4bedc6fe5686fa",
  measurementId: "G-VD6HVP2CVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export the auth instance and functions for OTP
export { auth, RecaptchaVerifier, signInWithPhoneNumber }; 