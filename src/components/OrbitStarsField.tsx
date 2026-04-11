"use client";

import { useCallback, useEffect, useRef } from "react";

type Orbiter = {
  a0: number;
  rx: number;
  ry: number;
  tilt: number;
  speed: number;
  rw: number;
  rh: number;
  rot: number;
  cr: number;
  cg: number;
  cb: number;
};

type Dust = { x: number; y: number; s: number; tw: number; a: number };

const PALETTE: [number, number, number][] = [
  [59, 130, 246],
  [239, 68, 68],
  [234, 179, 8],
  [168, 85, 247],
  [232, 121, 249],
  [34, 211, 238],
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildOrbiters(w: number, h: number, rand: () => number): Orbiter[] {
  const m = Math.min(w, h);
  const rings = [
    { rx: 0.32, ry: 0.11, tilt: 0.55, speed: 0.22, n: 52 },
    { rx: 0.38, ry: 0.13, tilt: -0.48, speed: -0.18, n: 64 },
    { rx: 0.44, ry: 0.15, tilt: 0.38, speed: 0.15, n: 72 },
    { rx: 0.5, ry: 0.17, tilt: -0.62, speed: -0.12, n: 80 },
    { rx: 0.58, ry: 0.19, tilt: 0.42, speed: 0.1, n: 88 },
    { rx: 0.66, ry: 0.21, tilt: -0.35, speed: -0.085, n: 96 },
  ];
  const out: Orbiter[] = [];
  for (const ring of rings) {
    const rx = ring.rx * m * 0.48;
    const ry = ring.ry * m * 0.48;
    for (let i = 0; i < ring.n; i++) {
      const c = PALETTE[Math.floor(rand() * PALETTE.length)]!;
      out.push({
        a0: (i / ring.n) * Math.PI * 2 + rand() * 0.4,
        rx,
        ry,
        tilt: ring.tilt,
        speed: ring.speed * (0.85 + rand() * 0.3),
        rw: 1.2 + rand() * 2.2,
        rh: 1 + rand() * 1.8,
        rot: rand() * Math.PI * 2,
        cr: c[0],
        cg: c[1],
        cb: c[2],
      });
    }
  }
  return out;
}

function buildDust(w: number, h: number, rand: () => number, n: number): Dust[] {
  const out: Dust[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: rand() * w,
      y: rand() * h,
      s: 0.4 + rand() * 1.2,
      tw: rand() * Math.PI * 2,
      a: 0.12 + rand() * 0.35,
    });
  }
  return out;
}

type Props = {
  className?: string;
  /** Lower = subtler (0.35–1). */
  intensity?: number;
};

/**
 * Antigravity-inspired orbital “stars” (see google antigravity landing) —
 * tilted ellipses, multicolor rects, edge falloff, mouse proximity glow.
 * Uses `pointer-events: none` so links above stay clickable; tracks `window` mousemove.
 */
export default function OrbitStarsField({ className = "", intensity = 0.85 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbitersRef = useRef<Orbiter[]>([]);
  const dustRef = useRef<Dust[]>([]);
  const mouseRef = useRef({ x: -1e9, y: -1e9 });
  const reducedMotionRef = useRef(false);
  const rafRef = useRef(0);
  const t0Ref = useRef(0);
  const logicalRef = useRef({ w: 320, h: 240, dpr: 1 });

  const resize = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
    const { width: cssW, height: cssH } = wrap.getBoundingClientRect();
    const w = Math.max(120, Math.floor(cssW));
    const h = Math.max(120, Math.floor(cssH));
    logicalRef.current = { w, h, dpr };
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const seed = Math.floor(w + h * 13);
    const rand = mulberry32(seed);
    orbitersRef.current = buildOrbiters(w, h, rand);
    dustRef.current = buildDust(w, h, rand, Math.min(140, Math.floor((w * h) / 9000)));
  }, []);

  useEffect(() => {
    reducedMotionRef.current =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [resize]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const onWinMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        mouseRef.current = { x: -1e9, y: -1e9 };
        return;
      }
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    window.addEventListener("mousemove", onWinMove, { passive: true });

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return () => window.removeEventListener("mousemove", onWinMove);
    }

    t0Ref.current = performance.now();

    const draw = (now: number) => {
      const { w, h } = logicalRef.current;
      const cx = w / 2;
      const cy = h / 2;
      const t = (now - t0Ref.current) / 1000;
      const slow = reducedMotionRef.current ? 0.15 : 1;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const maxDist = Math.hypot(w, h) * 0.52;

      for (const d of dustRef.current) {
        const tw = 0.55 + 0.45 * Math.sin(t * (0.8 + d.tw * 0.01) + d.tw);
        const fx = 1 - Math.min(1, Math.hypot(d.x - cx, d.y - cy) / maxDist) * 0.85;
        ctx.fillStyle = `rgba(200,230,255,${d.a * tw * fx * intensity})`;
        ctx.fillRect(d.x, d.y, d.s, d.s);
      }

      const orbiters = orbitersRef.current;
      for (let i = 0; i < orbiters.length; i++) {
        const p = orbiters[i];
        if (!p) continue;
        const ang = p.a0 + t * p.speed * slow;
        const ex = Math.cos(ang) * p.rx;
        const ey = Math.sin(ang) * p.ry;
        const x = cx + ex * Math.cos(p.tilt) - ey * Math.sin(p.tilt);
        const y = cy + ex * Math.sin(p.tilt) + ey * Math.cos(p.tilt);

        const distC = Math.hypot(x - cx, y - cy);
        const edgeFade = 1 - Math.min(1, Math.max(0, (distC - maxDist * 0.28) / (maxDist * 0.62)));
        const dm = Math.hypot(x - mx, y - my);
        const hover = mx > -1e8 ? Math.max(0, 1 - dm / 100) : 0;
        const alpha = (0.28 + hover * 0.55 + Math.sin(t * 2 + i * 0.07) * 0.06) * edgeFade * intensity;
        const scale = 1 + hover * 0.85 + (1 - distC / maxDist) * 0.15;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rot + ang * 0.15);
        ctx.fillStyle = `rgba(${p.cr},${p.cg},${p.cb},${Math.min(1, alpha)})`;
        if (hover > 0.05) {
          ctx.shadowColor = `rgba(${p.cr},${p.cg},${p.cb},${0.4 + hover * 0.5})`;
          ctx.shadowBlur = 12 + hover * 22;
        }
        ctx.fillRect((-p.rw * scale) / 2, (-p.rh * scale) / 2, p.rw * scale, p.rh * scale);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onWinMove);
    };
  }, [intensity]);

  return (
    <div
      ref={wrapRef}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] ${className}`}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
