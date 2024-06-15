import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcuWjxgQEgu-fnTpc3EQBMfw3J7ftozc4",
  authDomain: "forum-app-71ca9.firebaseapp.com",
  projectId: "forum-app-71ca9",
  storageBucket: "forum-app-71ca9.appspot.com",
  messagingSenderId: "73506448363",
  appId: "1:73506448363:web:569619763456064f112fae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { db }; // Estou exportando um objeto