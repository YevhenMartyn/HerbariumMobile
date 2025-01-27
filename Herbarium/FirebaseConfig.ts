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
  apiKey: "AIzaSyBR-x1flMc_e3XcxsAJr1pBqz7PsT4-vLA",
  authDomain: "herbariummobile.firebaseapp.com",
  projectId: "herbariummobile",
  storageBucket: "herbariummobile.firebasestorage.app",
  messagingSenderId: "810771806146",
  appId: "1:810771806146:web:544d6716dbafaaf626085b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const storage = getStorage(app);
export const firestore = getFirestore(app);
