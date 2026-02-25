// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Icosahedron, Float } from '@react-three/drei';
import * as THREE from 'three';

function NeuralCore() {
  const coreRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const particlesRef = useRef(null);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 0.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.2;
      coreRef.current.rotation.y = t * 0.3;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.3;
    if (ring3Ref.current) ring3Ref.current.rotation.x = t * 0.4;
    if (particlesRef.current) particlesRef.current.rotation.y = t * 0.1;
  });

  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={coreRef} args={[0.8, 32, 32]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} wireframe transparent opacity={0.9} />
        </Sphere>
      </Float>
      <Sphere args={[0.4, 16, 16]}>
        <meshStandardMaterial color="#00ffaa" emissive="#00ffaa" emissiveIntensity={2} transparent opacity={0.6} />
      </Sphere>
      <Torus ref={ring1Ref} args={[1.2, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
      </Torus>
      <Torus ref={ring2Ref} args={[1.5, 0.015, 16, 100]} rotation={[0, Math.PI / 3, 0]}>
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1} />
      </Torus>
      <Torus ref={ring3Ref} args={[1.8, 0.01, 16, 100]} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#00ffaa" emissive="#00ffaa" emissiveIntensity={0.8} />
      </Torus>
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial color="#00ffff" size={0.03} transparent opacity={0.6} sizeAttenuation />
      </points>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <Icosahedron args={[2.2, 1]}>
          <meshStandardMaterial color="#00ffff" wireframe transparent opacity={0.15} />
        </Icosahedron>
      </Float>
    </>
  );
}

export default function CanvasWrapper() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} color="#00ffff" intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={0.5} />
        <pointLight position={[0, 5, 0]} color="#00ffaa" intensity={0.5} />
        <NeuralCore />
      </Canvas>
    </div>
  );
}
