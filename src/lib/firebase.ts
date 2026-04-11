import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

function firebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export function isFirebaseConfigured(): boolean {
  const c = firebaseConfig();
  return Boolean(c.apiKey && c.databaseURL && c.projectId && c.appId);
}

/** Call only from client components. */
export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase must be used on the client.");
  }
  const c = firebaseConfig();
  if (!c.apiKey || !c.databaseURL) {
    throw new Error("Firebase env vars missing. Set NEXT_PUBLIC_FIREBASE_* in .env.local.");
  }
  if (!getApps().length) {
    initializeApp(c);
  }
  return getApps()[0]!;
}

export function getFirebaseDatabase(): Database {
  return getDatabase(getFirebaseApp());
}

/** GA4 — safe to call once from a client page (e.g. /enquiry). */
export async function initFirebaseAnalytics(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!isFirebaseConfigured()) return;
  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    const ok = await isSupported();
    if (ok) {
      getAnalytics(getFirebaseApp());
    }
  } catch {
    /* ignore analytics failures */
  }
}
