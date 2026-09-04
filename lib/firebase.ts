"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  isGuest: boolean;
  victorianRank: string;
  avatarSeal: string;
  certifiedAt: string;
}

// Default demo Firebase config (user can provide their real config via modal)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoVictorianApparatusKey1888",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "logbook-victorian-telemetry.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "logbook-victorian-telemetry",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "logbook-victorian-telemetry.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "188809041234",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:188809041234:web:victoriantelemetry",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getFirebaseInstance() {
  if (typeof window === "undefined") return { app: null, auth: null };

  if (!app && getApps().length === 0) {
    try {
      // Check for locally saved custom credentials
      const savedConfig = localStorage.getItem("victorian_firebase_config");
      const config = savedConfig ? JSON.parse(savedConfig) : DEFAULT_FIREBASE_CONFIG;
      app = initializeApp(config);
      auth = getAuth(app);
    } catch (e) {
      console.warn("Firebase initialization deferred (using Guest Inspector mode):", e);
    }
  } else if (!app && getApps().length > 0) {
    app = getApps()[0];
    auth = getAuth(app);
  }
  return { app, auth };
}

// Guest Inspector Profile Generator
export function createGuestInspector(): UserProfile {
  const titles = [
    "Chief Galvanic Telegraphist",
    "Imperial Telemetry Inspector",
    "Royal Logbook Diagnostician",
    "Master Steamworks Cryptanalyst",
    "High Commissioner of Packet Integrity",
  ];
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomId = Math.floor(1000 + Math.random() * 9000);

  const guest: UserProfile = {
    uid: `guest-inspector-${randomId}`,
    email: `inspector.${randomId}@royal-telegraph.org`,
    displayName: `Lord / Lady Inspector #${randomId}`,
    isGuest: true,
    victorianRank: randomTitle,
    avatarSeal: "⚖",
    certifiedAt: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem("victorian_user_session", JSON.stringify(guest));
  }
  return guest;
}

export function getSavedSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("victorian_user_session");
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function clearUserSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("victorian_user_session");
  try {
    const { auth } = getFirebaseInstance();
    if (auth) fbSignOut(auth);
  } catch {
    // Ignore
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const { auth } = getFirebaseInstance();
  if (auth && !auth.app.options.apiKey?.includes("Demo")) {
    try {
      const creds = await signInWithEmailAndPassword(auth, email, pass);
      const profile: UserProfile = {
        uid: creds.user.uid,
        email: creds.user.email,
        displayName: creds.user.displayName || email.split("@")[0],
        isGuest: false,
        victorianRank: "Certified Imperial Telegraphist",
        avatarSeal: "⚜",
        certifiedAt: new Date().toLocaleDateString("en-GB"),
      };
      localStorage.setItem("victorian_user_session", JSON.stringify(profile));
      return profile;
    } catch (e: any) {
      throw new Error(e.message || "Authentication rejected by Royal Gateway.");
    }
  }

  // Graceful simulation when demo credentials are used
  const simulated: UserProfile = {
    uid: `auth-usr-${Date.now().toString().slice(-4)}`,
    email: email,
    displayName: email.split("@")[0],
    isGuest: false,
    victorianRank: "Certified Imperial Telegraphist",
    avatarSeal: "⚜",
    certifiedAt: new Date().toLocaleDateString("en-GB"),
  };
  localStorage.setItem("victorian_user_session", JSON.stringify(simulated));
  return simulated;
}

export async function registerWithEmail(email: string, pass: string): Promise<UserProfile> {
  const { auth } = getFirebaseInstance();
  if (auth && !auth.app.options.apiKey?.includes("Demo")) {
    try {
      const creds = await createUserWithEmailAndPassword(auth, email, pass);
      const profile: UserProfile = {
        uid: creds.user.uid,
        email: creds.user.email,
        displayName: email.split("@")[0],
        isGuest: false,
        victorianRank: "Junior Telegraph Scholar",
        avatarSeal: "⚜",
        certifiedAt: new Date().toLocaleDateString("en-GB"),
      };
      localStorage.setItem("victorian_user_session", JSON.stringify(profile));
      return profile;
    } catch (e: any) {
      throw new Error(e.message || "Registration failed at the Victorian Registry.");
    }
  }

  const simulated: UserProfile = {
    uid: `reg-usr-${Date.now().toString().slice(-4)}`,
    email: email,
    displayName: email.split("@")[0],
    isGuest: false,
    victorianRank: "Junior Telegraph Scholar",
    avatarSeal: "⚜",
    certifiedAt: new Date().toLocaleDateString("en-GB"),
  };
  localStorage.setItem("victorian_user_session", JSON.stringify(simulated));
  return simulated;
}
