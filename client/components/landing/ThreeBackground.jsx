"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField({ count = 400, color = "#f5a623", spread = 22, depth = 12, speed = 0.04 }) {
  const mesh = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * depth;
    }
    return pos;
  }, [count, spread, depth]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = clock.elapsedTime * speed;
    mesh.current.rotation.x = Math.sin(clock.elapsedTime * speed * 0.5) * 0.15;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color={color} transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

function GridLines() {
  const ref = useRef();
  const geometry = useMemo(() => {
    const pts = [];
    for (let i = -10; i <= 10; i += 2) {
      pts.push(new THREE.Vector3(i, -10, 0), new THREE.Vector3(i, 10, 0));
      pts.push(new THREE.Vector3(-10, i, 0), new THREE.Vector3(10, i, 0));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.z = -5 + Math.sin(clock.elapsedTime * 0.2) * 0.5;
    ref.current.material.opacity = 0.06 + Math.sin(clock.elapsedTime * 0.3) * 0.02;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#1a3a6e" transparent opacity={0.07} />
    </lineSegments>
  );
}

export default function ThreeBackground() {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      camera={{ position: [0, 0, 10], fov: 55 }}
      gl={{ alpha: true, antialias: false }}
    >
      <ParticleField count={450} color="#f5a623" spread={24} depth={10} speed={0.035} />
      <ParticleField count={200} color="#2a5fad" spread={18} depth={6} speed={0.02} />
      <GridLines />
    </Canvas>
  );
}