import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Bean({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => { if (ref.current) ref.current.rotation.y += 0.002 + Math.sin(state.clock.elapsedTime) * 0.0005; });
  return <Float speed={1.1} rotationIntensity={0.8} floatIntensity={1.15}>
    <group ref={ref} position={position} scale={scale}>
      <mesh scale={[1, 0.72, 0.55]} rotation={[0.2, 0.3, 0.35]} castShadow><sphereGeometry args={[0.25, 32, 24]} /><meshStandardMaterial color="#3a1b10" roughness={0.34} /></mesh>
      <mesh position={[0, 0, 0.14]} rotation={[0.2, 0.3, 0.35]}><torusGeometry args={[0.17, 0.018, 10, 40, Math.PI * 1.45]} /><meshStandardMaterial color="#75442b" roughness={0.5} /></mesh>
    </group>
  </Float>;
}

function Steam({ x, delay }: { x: number; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => { if (ref.current) { const t = state.clock.elapsedTime + delay; ref.current.position.x = x + Math.sin(t * 1.1) * 0.07; ref.current.position.y = 1.25 + ((t * 0.18) % 0.8); ref.current.rotation.z = Math.sin(t * 1.4) * 0.15; } });
  return <mesh ref={ref} position={[x, 1.25, 0]} scale={[0.07, 0.42, 0.07]}><sphereGeometry args={[1, 20, 20]} /><meshStandardMaterial color="#f2dfcc" transparent opacity={0.16} roughness={0.9} /></mesh>;
}

function CoffeeCup() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => { if (ref.current) { const t = state.clock.elapsedTime; ref.current.rotation.y = Math.sin(t * 0.42) * 0.16; ref.current.rotation.x = Math.sin(t * 0.32) * 0.025; ref.current.position.y = Math.sin(t * 0.9) * 0.07; } });
  return <group ref={ref}>
    <mesh castShadow receiveShadow><cylinderGeometry args={[1.35, 1.16, 1.18, 64]} /><meshStandardMaterial color="#efe5d7" roughness={0.2} metalness={0.04} /></mesh>
    <mesh position={[0, 0.61, 0]}><cylinderGeometry args={[1.18, 1.18, 0.075, 64]} /><meshStandardMaterial color="#281109" roughness={0.16} /></mesh>
    <mesh position={[1.36, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.55, 0.12, 28, 64]} /><meshStandardMaterial color="#efe5d7" roughness={0.2} /></mesh>
    <mesh position={[0, -0.7, 0]} receiveShadow><cylinderGeometry args={[1.68, 1.5, 0.13, 64]} /><meshStandardMaterial color="#cdb9a6" roughness={0.28} /></mesh>
    <Steam x={-0.28} delay={0} /><Steam x={0.08} delay={1.7} /><Steam x={0.34} delay={3.1} />
  </group>;
}

function Scene() {
  return <>
    <ambientLight intensity={1.05} />
    <directionalLight position={[4, 6, 5]} intensity={3.2} castShadow shadow-mapSize={[1024, 1024]} />
    <pointLight position={[-4, 2, 3]} intensity={2.2} color="#c98a57" />
    <Float speed={1.15} rotationIntensity={0.16} floatIntensity={0.5}><CoffeeCup /></Float>
    <Bean position={[-2.35, 1.5, 0]} scale={1.15} /><Bean position={[2.15, 1.2, 0]} scale={0.78} /><Bean position={[-2.1, -1.2, 0]} scale={0.7} /><Bean position={[2.25, -1.35, 0]} scale={0.9} />
    <Environment preset="studio" />
  </>;
}

export default function CoffeeScene() {
  return <div className="coffee-3d-canvas" aria-label="Interactive 3D CoffeeHub coffee cup">
    <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 1, 6.6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
      <Scene />
    </Canvas>
  </div>;
}
