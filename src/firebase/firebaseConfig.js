// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFdcFmnOKOJZu3MvuJlLxWIDOebmW1HJY",
  authDomain: "financechatbot-ea77b.firebaseapp.com",
  projectId: "financechatbot-ea77b",
  storageBucket: "financechatbot-ea77b.appspot.com",
  messagingSenderId: "22972962135",
  appId: "1:22972962135:web:6b84cd960c2502004bda12",
  measurementId: "G-WJT1H70DZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
