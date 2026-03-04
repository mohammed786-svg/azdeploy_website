"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Scene3DContent } from "./Scene3DInstallingPython";

function Fallback() {
  return (
    <div className="doc-scene-3d-fallback">
      <p>Loading 3D…</p>
    </div>
  );
}

export function Scene3DCanvas({ className }: { className?: string }) {
  return (
    <div className={`doc-scene-canvas-wrap ${className ?? ""}`.trim()} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        shadows
        style={{ background: "#eef2f6" }}
      >
        <Suspense fallback={null}>
          <Scene3DContent />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={3}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
