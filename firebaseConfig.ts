import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken } from "firebase/auth";
import { getFirestore, setLogLevel } from "firebase/firestore";

// --- IMPORTANT ---
// You must get this configuration object from your own Firebase project.
// Go to Project Settings > General > Your apps > Web app
//
// DO NOT hardcode your real config here if this is a public repository.
// For local dev, you can paste it here, but for deployment, use
// environment variables (e.g., import.meta.env.VITE_FIREBASE_CONFIG)
// Declare global variables for TypeScript
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;
declare const __app_id: string | undefined;

let firebaseConfig;

if (typeof window !== 'undefined' && '__firebase_config' in window) {
  // This global var is provided in the AI Studio environment
  firebaseConfig = JSON.parse(__firebase_config as string);
} else {
  // Fallback for local development
  // REPLACE THIS with your actual Firebase config object
  console.warn("Using fallback Firebase config. Please set up __firebase_config or add your local config.");
  firebaseConfig = {
  apiKey: "AIzaSyA1ashHEqtJ493YESyJDfOlVBLSbwTrO9I",
  authDomain: "room-rumble-c1653.firebaseapp.com",
  projectId: "room-rumble-c1653",
  storageBucket: "room-rumble-c1653.firebasestorage.app",
  messagingSenderId: "696779204963",
  appId: "1:696779204963:web:8eea89b1f7e9ec2ef18b56",
  measurementId: "G-88YS2BF6BC"
};
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable debug logging for Firestore
setLogLevel('debug');

/**
 * Signs the user in.
 * In the AI Studio environment, __initial_auth_token is provided.
 * Locally, it falls back to anonymous sign-in.
 */
export const authenticateUser = async () => {
  try {
    if (typeof window !== 'undefined' && '__initial_auth_token' in window && __initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
  }
};

/**
 * Gets the app ID, which is crucial for Firestore paths.
 */
export const getAppId = () => {
  // This global var is provided in the AI Studio environment
  return typeof window !== 'undefined' && '__app_id' in window ? __app_id : 'default-app-id';
};

export { app, auth, db };