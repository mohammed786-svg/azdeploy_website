"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh } from "three";

function Monitor() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, t) => {
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.06;
  });
  // Light theme colours
  const bezelColor = "#c8ced6";
  const screenGlow = "#a8c8e0";
  const standColor = "#b8bec6";
  return (
    <group ref={groupRef} position={[-1.85, 0, 0]}>
      {/* Bezel (outer frame) - matte plastic */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.28, 0.76, 0.1]} />
        <meshStandardMaterial
          color={bezelColor}
          roughness={0.85}
          metalness={0.08}
          envMapIntensity={0.3}
        />
      </mesh>
      {/* Screen recess (inner bezel) */}
      <mesh castShadow receiveShadow position={[0, 0, 0.028]}>
        <boxGeometry args={[1.16, 0.64, 0.028]} />
        <meshStandardMaterial
          color="#e0e4e8"
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      {/* Glass / screen surface */}
      <mesh position={[0, 0, 0.042]} receiveShadow>
        <planeGeometry args={[1.1, 0.58]} />
        <meshStandardMaterial
          color={screenGlow}
          emissive={screenGlow}
          emissiveIntensity={0.08}
          roughness={0.2}
          metalness={0.02}
        />
      </mesh>
      {/* Stand neck */}
      <mesh castShadow receiveShadow position={[0, -0.38, -0.06]}>
        <cylinderGeometry args={[0.04, 0.08, 0.18, 16]} />
        <meshStandardMaterial
          color={standColor}
          roughness={0.8}
          metalness={0.15}
        />
      </mesh>
      {/* Stand base */}
      <mesh castShadow receiveShadow position={[0, -0.48, -0.06]}>
        <boxGeometry args={[0.36, 0.04, 0.22]} />
        <meshStandardMaterial
          color={standColor}
          roughness={0.8}
          metalness={0.12}
        />
      </mesh>
    </group>
  );
}

function Globe() {
  const sphereRef = useRef<Mesh>(null);
  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.51, 2), 15),
    []
  );
  useFrame((_, t) => {
    if (sphereRef.current) sphereRef.current.rotation.y = t * 0.15;
  });
  // Realistic globe: matte sphere + thin metal ring stand
  return (
    <group position={[0, 0, 0]}>
      <mesh ref={sphereRef} castShadow receiveShadow>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshStandardMaterial
          color="#6eb4d8"
          roughness={0.7}
          metalness={0.05}
          envMapIntensity={0.4}
        />
      </mesh>
      {/* Latitude/longitude lines */}
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color="#2a8ab8" />
      </lineSegments>
      {/* Stand: curved arm + base ring */}
      <mesh position={[0, -0.52, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.32, 0.028, 8, 24]} />
        <meshStandardMaterial color="#8890a0" roughness={0.45} metalness={0.35} />
      </mesh>
      <mesh position={[0, -0.38, -0.28]} castShadow receiveShadow>
        <cylinderGeometry args={[0.025, 0.04, 0.22, 12]} />
        <meshStandardMaterial color="#7a8290" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

function PythonBox() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, t) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.2;
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.03;
    }
  });
  // Light theme colours
  return (
    <group ref={groupRef} position={[1.85, 0, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.72, 0.72]} />
        <meshStandardMaterial
          color="#5cb89a"
          roughness={0.85}
          metalness={0.02}
        />
      </mesh>
      {/* Front face label */}
      <mesh position={[0, 0, 0.361]} castShadow>
        <circleGeometry args={[0.22, 32]} />
        <meshStandardMaterial
          color="#2d9d82"
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>
      {/* Python logo dot */}
      <mesh position={[0, 0, 0.362]} castShadow>
        <circleGeometry args={[0.06, 24]} />
        <meshStandardMaterial color="#e8b830" roughness={0.5} metalness={0} />
      </mesh>
    </group>
  );
}

function Arrow() {
  const arrowColor = "#0a9ec4";
  return (
    <group position={[0, 0.62, 0]} rotation={[0, 0, -Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.38, 10]} />
        <meshStandardMaterial color={arrowColor} roughness={0.55} metalness={0.12} />
      </mesh>
      <mesh position={[0.22, 0, 0]} castShadow>
        <coneGeometry args={[0.07, 0.14, 16]} />
        <meshStandardMaterial color={arrowColor} roughness={0.55} metalness={0.12} />
      </mesh>
    </group>
  );
}

export function Scene3DContent() {
  return (
    <>
      <color attach="background" args={["#eef2f6"]} />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        shadow-camera-far={15}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-2, 3, 2]} intensity={0.5} />
      <pointLight position={[0, 2, 3]} intensity={0.35} color="#ffffff" />
      <Monitor />
      <Arrow />
      <Globe />
      <group position={[0.92, 0.62, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.48, 10]} />
          <meshStandardMaterial color="#0a9ec4" roughness={0.55} metalness={0.12} />
        </mesh>
        <mesh position={[0.26, 0, 0]} castShadow>
          <coneGeometry args={[0.055, 0.11, 16]} />
          <meshStandardMaterial color="#0a9ec4" roughness={0.55} metalness={0.12} />
        </mesh>
      </group>
      <PythonBox />
    </>
  );
}
