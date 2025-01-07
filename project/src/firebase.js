import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-7e895.firebaseapp.com",
  projectId: "mern-estate-7e895",
  storageBucket: "mern-estate-7e895.appspot.com",
  messagingSenderId: "941477091473",
  appId: "1:941477091473:web:6d22a229aeb154b4874730",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
