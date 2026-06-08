import "server-only";

import { getAuth } from "firebase-admin/auth";
import { getAdminApp, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

export function isFirebaseAuthAdminConfigured(): boolean {
  return isFirebaseAdminConfigured();
}

export async function verifyFirebaseIdToken(idToken: string) {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase Admin is not configured");
  }
  const auth = getAuth(getAdminApp());
  return auth.verifyIdToken(idToken);
}
