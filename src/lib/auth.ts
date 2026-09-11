import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type Auth,
} from "firebase/auth";
import { app, firebaseConfigured } from "./firebase";

export const auth: Auth | null = firebaseConfigured && app ? getAuth(app) : null;

const googleProvider = new GoogleAuthProvider();

function requireAuth(): Auth {
  if (!auth) {
    throw new Error("Sign-in is not configured yet. Please try again later.");
  }
  return auth;
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(requireAuth(), email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(requireAuth(), email, password);
}

export async function signInWithGoogle() {
  return signInWithPopup(requireAuth(), googleProvider);
}

export async function signOut() {
  if (auth) return firebaseSignOut(auth);
}
