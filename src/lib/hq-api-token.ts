import crypto from "crypto";

export function makeHqApiToken(secret: string): string {
  const exp = Math.floor(Date.now() / 1000) + 8 * 3600;
  const body = JSON.stringify({ exp, v: 1 });
  const bodyBuf = Buffer.from(body, "utf8");
  const sig = crypto.createHmac("sha256", secret).update(bodyBuf).digest();
  return Buffer.concat([bodyBuf, Buffer.from("."), sig]).toString("base64url");
}

export function verifyHqApiToken(raw: string, secret: string): boolean {
  try {
    const pad = (4 - (raw.length % 4)) % 4;
    const decoded = Buffer.from(raw + "=".repeat(pad), "base64url");
    const dot = decoded.indexOf(0x2e);
    if (dot < 0) return false;
    const bodyBuf = decoded.subarray(0, dot);
    const sigBytes = decoded.subarray(dot + 1);
    const expected = crypto.createHmac("sha256", secret).update(bodyBuf).digest();
    if (sigBytes.length !== expected.length || !crypto.timingSafeEqual(sigBytes, expected)) return false;
    const payload = JSON.parse(bodyBuf.toString("utf8")) as { exp?: number };
    return Number(payload.exp) >= Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
