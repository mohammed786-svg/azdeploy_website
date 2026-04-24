const MASK_PREFIX = "AZCRASH_1.0";
const ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function hashText(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36).toUpperCase().padStart(6, "0");
}

function buildUniqueChunk(seed: string, len: number, avoid = ""): string {
  let state = 0;
  for (let i = 0; i < seed.length; i += 1) state = (state * 131 + seed.charCodeAt(i)) >>> 0;
  const used = new Set(avoid.split(""));
  let out = "";
  let spin = 0;
  while (out.length < len && spin < 300) {
    state = (Math.imul(state ^ 0x9e3779b9, 1664525) + 1013904223) >>> 0;
    const ch = ALPHANUM[state % ALPHANUM.length];
    if (!used.has(ch)) {
      out += ch;
      used.add(ch);
    }
    spin += 1;
  }
  return out.padEnd(len, "Z").slice(0, len);
}

export function maskStudentId(raw: unknown): string {
  if (raw == null) return "—";
  const txt = String(raw).trim();
  if (!txt) return "—";
  const hash = hashText(txt);
  const letters = buildUniqueChunk(`L:${txt}:${hash}`, 3);
  const sourceDigits = (txt.match(/\d/g) ?? []).join("");
  const hashDigits = (hash.match(/\d/g) ?? []).join("") || "57";
  const d1 = (sourceDigits.slice(-2, -1) || sourceDigits.slice(-1) || hashDigits[0] || "5").slice(0, 1);
  const d2 = (sourceDigits.slice(-1) || hashDigits[1] || hashDigits[0] || "7").slice(0, 1);
  const token = `${letters[0]}${d1}${letters[1]}${d2}${letters[2]}`;
  return `${MASK_PREFIX}-${token}`;
}
