"use client";

import { useRef, Suspense } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const TEAL = "#00d4ff";

function Card({
  position,
  title,
  points,
  accentColor = TEAL,
}: {
  position: [number, number, number];
  title: string;
  points: string[];
  accentColor?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, t) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 0.08]} />
        <meshStandardMaterial
          color="#1a2530"
          emissive="#0d1520"
          emissiveIntensity={0.08}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      <Html
        position={[0, 0, 0.05]}
        center
        transform
        occlude
        zIndexRange={[1, 0]}
        style={{
          pointerEvents: "none",
          width: "180px",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "10px",
          color: "#fff",
          background: "rgba(0,0,0,0.6)",
          padding: "10px 12px",
          borderRadius: "8px",
          border: `1px solid ${accentColor}40`,
        }}
      >
        <div style={{ fontWeight: 700, color: accentColor, marginBottom: 6, fontSize: "11px" }}>{title}</div>
        <ul style={{ margin: 0, paddingLeft: "14px", lineHeight: 1.5 }}>
          {points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </Html>
    </group>
  );
}

export function WhyPythonFullStackSceneContent() {
  return (
    <>
      <color attach="background" args={["#0e1419"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 5]} intensity={1.2} />
      <pointLight position={[0, 0, 4]} intensity={0.5} color={TEAL} />
      <Card
        position={[-2.15, 0.25, 0]}
        title="Why Python?"
        points={[
          "Readable syntax, fast to write",
          "Huge ecosystem (Django, Flask, pandas)",
          "Web, data, DevOps, automation",
        ]}
      />
      <Card
        position={[2.15, -0.25, 0]}
        title="Why full stack?"
        points={[
          "Understand the whole system",
          "UI + API + DB + deploy",
          "More employable, ship alone",
        ]}
        accentColor="#2d9d82"
      />
      {/* Connector line — spans gap between cards */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[4.2, 0.04, 0.02]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.15} roughness={0.5} metalness={0.2} />
      </mesh>
    </>
  );
}

/** Wrapper with Canvas for use in DynamicScene (3D Explanation panel). */
export function WhyPythonFullStackScene({ fullScreen }: { fullScreen?: boolean }) {
  return (
    <div
      className="doc-scene-3d doc-scene-three doc-framer-flowchart-3d"
      data-fullscreen={fullScreen ? "true" : undefined}
      style={{ width: "100%", height: "100%", minHeight: fullScreen ? undefined : 240, position: "relative" }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ display: "block", position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <WhyPythonFullStackSceneContent />
          <OrbitControls
            target={[0, 0, 0]}
            enableRotate
            enableZoom
            enablePan
            minDistance={3}
            maxDistance={12}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
