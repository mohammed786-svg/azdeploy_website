type ToastType = "error" | "success" | "info";

function palette(type: ToastType) {
  if (type === "success") return { border: "#22c55e66", text: "#86efac" };
  if (type === "info") return { border: "#38bdf866", text: "#7dd3fc" };
  return { border: "#f8717166", text: "#fca5a5" };
}

/** Lightweight, dependency-free toast for API/runtime feedback. */
export function showToast(message: string, type: ToastType = "error"): void {
  if (typeof window === "undefined") return;

  const rootId = "__az_toast_root__";
  let root = document.getElementById(rootId);
  if (!root) {
    root = document.createElement("div");
    root.id = rootId;
    root.style.position = "fixed";
    root.style.right = "16px";
    root.style.bottom = "16px";
    root.style.zIndex = "9999";
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.gap = "8px";
    document.body.appendChild(root);
  }

  const p = palette(type);
  const el = document.createElement("div");
  el.textContent = message;
  el.style.maxWidth = "380px";
  el.style.background = "rgba(2,6,23,0.95)";
  el.style.border = `1px solid ${p.border}`;
  el.style.color = p.text;
  el.style.padding = "10px 12px";
  el.style.borderRadius = "10px";
  el.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
  el.style.fontSize = "12px";
  el.style.lineHeight = "1.4";
  el.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
  el.style.opacity = "0";
  el.style.transform = "translateY(8px)";
  el.style.transition = "all 180ms ease";

  root.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });

  window.setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(6px)";
    window.setTimeout(() => el.remove(), 220);
  }, 3600);
}
