
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Color } from 'three';

interface AnimatedSphereProps {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
}

const AnimatedSphere: React.FC<AnimatedSphereProps> = ({ position, color, speed, distort }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x = mesh.current.rotation.y += 0.001 * speed;
    }
  });
  
  return (
    <Sphere ref={mesh} args={[1, 100, 200]} position={position}>
      <MeshDistortMaterial 
        color={color} 
        attach="material" 
        distort={distort} 
        speed={speed * 0.5} 
        roughness={0.5} 
        metalness={0.2}
      />
    </Sphere>
  );
};

interface ThreeDBackgroundProps {
  className?: string;
}

const ThreeDBackground: React.FC<ThreeDBackgroundProps> = ({ className }) => {
  return (
    <div className={`fixed inset-0 -z-10 opacity-40 ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <AnimatedSphere position={[-3, 0, 0]} color="#2271b1" speed={2} distort={0.4} />
        <AnimatedSphere position={[3, 0, 0]} color="#6B7280" speed={1.5} distort={0.5} />
        <AnimatedSphere position={[0, 2, -2]} color="#10B981" speed={1} distort={0.3} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;
