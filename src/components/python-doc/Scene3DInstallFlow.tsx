"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const TEAL = "#00d4ff";
const STEP_GAP = 1.15;
/** Scale so full flow fits in viewport with margin */
const FLOW_SCALE = 0.58;

const FLOW_STEPS = [
  { id: 1, label: "Open browser" },
  { id: 2, label: "Go to python.org/downloads" },
  { id: 3, label: "Download Python 3.x" },
  { id: 4, label: "Run installer (Windows / Mac / Linux)" },
  { id: 5, label: "Open CMD (Win) or Terminal (Mac/Linux)" },
  { id: 6, label: "python --version or python3 --version" },
  { id: 7, label: "✓ Python installed" },
];

export type FlowStep = { id: number; label: string };

function FlowNode({ step, index, isLastStep }: { step: FlowStep; index: number; isLastStep: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const y = index * STEP_GAP;

  useFrame((_, t) => {
    if (groupRef.current) {
      groupRef.current.position.y = y + Math.sin(t * 0.8 + index * 0.5) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.35, 0.4, 0.06]} />
        <meshStandardMaterial
          color={isLastStep ? "#2d9d82" : "#1a2530"}
          emissive={isLastStep ? "#1a4a3a" : "#0d1520"}
          emissiveIntensity={isLastStep ? 0.15 : 0.08}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      <Html
        position={[0, 0, 0.06]}
        center
        transform
        occlude
        zIndexRange={[1, 0]}
        style={{
          pointerEvents: "none",
          width: "200px",
          textAlign: "center",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "10px",
          color: "#fff",
          background: "rgba(0,0,0,0.5)",
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid rgba(0, 212, 255, 0.4)",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: TEAL, fontWeight: 700, marginRight: 6 }}>{step.id}</span>
        {step.label}
      </Html>
    </group>
  );
}

function FlowArrow({ fromY, toY }: { fromY: number; toY: number }) {
  const len = toY - fromY - 0.5;
  const midY = (fromY + toY) / 2;

  return (
    <group position={[0, midY, -0.1]}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, len, 8]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.2} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, len / 2, 0]}>
        <coneGeometry args={[0.06, 0.12, 12]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.2} roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}

export function Scene3DInstallFlowContent({ steps = FLOW_STEPS }: { steps?: FlowStep[] }) {
  const flowCenterY = (steps.length - 1) * STEP_GAP / 2;
  return (
    <>
      <color attach="background" args={["#0e1419"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 5]} intensity={1.2} />
      <pointLight position={[0, 0, 4]} intensity={0.5} color={TEAL} />
      <group position={[0, -flowCenterY, 0]} scale={[FLOW_SCALE, FLOW_SCALE, FLOW_SCALE]}>
        {steps.map((step, i) => (
          <FlowNode key={step.id} step={step} index={i} isLastStep={i === steps.length - 1} />
        ))}
        {steps.slice(0, -1).map((_, i) => (
          <FlowArrow key={i} fromY={i * STEP_GAP} toY={(i + 1) * STEP_GAP} />
        ))}
      </group>
    </>
  );
}
