import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function CoffeeCup() {
  const cupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!cupRef.current) return;

    cupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.5) * 0.08;

    cupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
  });

  return (
    <group ref={cupRef}>
      {/* Cup */}
      <mesh castShadow>
        <cylinderGeometry args={[1.45, 1.25, 1.25, 64]} />
        <meshStandardMaterial
          color="#f4eee6"
          roughness={0.25}
          metalness={0.05}
        />
      </mesh>

      {/* Coffee */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.08, 64]} />
        <meshStandardMaterial
          color="#4a2415"
          roughness={0.2}
        />
      </mesh>

      {/* Handle */}
      <mesh position={[1.45, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.65, 0.14, 32, 64]} />
        <meshStandardMaterial
          color="#f4eee6"
          roughness={0.25}
        />
      </mesh>

      {/* Saucer */}
      <mesh
        position={[0, -0.72, 0]}
        receiveShadow
      >
        <cylinderGeometry args={[1.8, 1.6, 0.15, 64]} />
        <meshStandardMaterial
          color="#ded3c6"
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function CoffeeBean({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <Float
      speed={1.5}
      rotationIntensity={1}
      floatIntensity={1.2}
    >
      <mesh position={position} scale={scale} rotation={[0.3, 0.4, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color="#3b1d12"
          roughness={0.35}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[4, 6, 5]}
        intensity={3}
        castShadow
      />

      <pointLight
        position={[-4, 2, 3]}
        intensity={2}
        color="#d69b6d"
      />

      <Float
        speed={1.5}
        rotationIntensity={0.4}
        floatIntensity={0.6}
      >
        <CoffeeCup />
      </Float>

      <CoffeeBean position={[-2.3, 1.5, 0]} scale={1.2} />
      <CoffeeBean position={[2.2, 1.2, 0]} scale={0.8} />
      <CoffeeBean position={[-2, -1.2, 0]} scale={0.7} />
      <CoffeeBean position={[2.3, -1.4, 0]} scale={1} />

      <Environment preset="studio" />
    </>
  );
}

export default function CoffeeScene() {
  return (
    <div
      style={{
        width: "100%",
        height: "520px",
        position: "relative",
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [0, 1, 7],
          fov: 42,
        }}
      >
        <Scene />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.4}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}