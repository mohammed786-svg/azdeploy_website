"use client";

import { useRef } from "react";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Scene3DInstallFlowContent, type FlowStep } from "./Scene3DInstallFlow";

export function Scene3DCanvasInstallFlow({ className, fullScreen, steps }: { className?: string; fullScreen?: boolean; steps?: FlowStep[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatchZoom = (deltaY: number) => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (canvas) canvas.dispatchEvent(new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }));
  };

  return (
    <div
      ref={containerRef}
      className={className ?? "doc-framer-flowchart-3d"}
      style={{
        width: "100%",
        height: "100%",
        minHeight: fullScreen ? undefined : 240,
        position: "relative",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ display: "block", position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <Scene3DInstallFlowContent steps={steps} />
          <OrbitControls
            target={[0, 0, 0]}
            enableRotate
            enableZoom
            enablePan
            minDistance={3}
            maxDistance={14}
            zoomSpeed={1.2}
            panSpeed={1.5}
            rotateSpeed={0.8}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
      <div className="doc-framer-flowchart-3d-zoom" aria-hidden>
        <button type="button" onClick={() => dispatchZoom(-120)} title="Zoom in">+</button>
        <button type="button" onClick={() => dispatchZoom(120)} title="Zoom out">−</button>
      </div>
    </div>
  );
}
