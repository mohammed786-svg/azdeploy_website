import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getDatabase, type Database } from "firebase-admin/database";

let app: App | null = null;

function resolveServiceAccountPath(raw: string): string {
  const trimmed = raw.trim();
  if (path.isAbsolute(trimmed)) return trimmed;
  return path.join(process.cwd(), trimmed);
}

function loadServiceAccount(): Record<string, unknown> {
  /** Vercel/serverless: paste full JSON or use base64 to avoid path / quoting issues. */
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64?.trim();
  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 is invalid (must be base64 of the service account JSON file)."
      );
    }
  }
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) {
    return JSON.parse(inline) as Record<string, unknown>;
  }
  const fileEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (fileEnv?.trim()) {
    const resolved = resolveServiceAccountPath(fileEnv);
    if (!existsSync(resolved)) {
      throw new Error(
        `FIREBASE_SERVICE_ACCOUNT_PATH not found: ${resolved} (cwd: ${process.cwd()})`
      );
    }
    const raw = readFileSync(resolved, "utf8");
    return JSON.parse(raw) as Record<string, unknown>;
  }
  throw new Error(
    "Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_SERVICE_ACCOUNT_JSON_BASE64, or FIREBASE_SERVICE_ACCOUNT_PATH (local file only)."
  );
}

export function isFirebaseAdminConfigured(): boolean {
  const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!dbUrl) return false;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64?.trim()) return true;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return true;
  const p = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (!p) return false;
  const resolved = resolveServiceAccountPath(p);
  return existsSync(resolved);
}

/** Server-only. Uses FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON + NEXT_PUBLIC_FIREBASE_DATABASE_URL. */
export function getAdminApp(): App {
  if (app) return app;
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!databaseURL) {
    throw new Error("NEXT_PUBLIC_FIREBASE_DATABASE_URL is not set.");
  }
  if (!getApps().length) {
    const cred = loadServiceAccount() as Parameters<typeof cert>[0];
    app = initializeApp({
      credential: cert(cred),
      databaseURL,
    });
  } else {
    app = getApps()[0]!;
  }
  return app!;
}

export function getAdminDatabase(): Database {
  return getDatabase(getAdminApp());
}
