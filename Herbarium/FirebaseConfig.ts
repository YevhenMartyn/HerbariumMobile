// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdwWt30_-fMYJN4InT9WwZ6H0yhd03WiE",
  authDomain: "herbarium-e9ce3.firebaseapp.com",
  projectId: "herbarium-e9ce3",
  storageBucket: "herbarium-e9ce3.firebasestorage.app",
  messagingSenderId: "243059653570",
  appId: "1:243059653570:web:e2a6b7fb4f9c4f6aaa745b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const storage = getStorage(app);
export const firestore = getFirestore(app);
