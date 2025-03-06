
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Point, Points } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleAnimationProps {
  count?: number;
  className?: string;
  color?: string;
  size?: number;
}

const ParticleCloud = ({ count = 500, color = '#4299e1', size = 2 }) => {
  const mesh = useRef<THREE.Points>(null);
  
  // Generate random positions for particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);
  
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Gentle rotation for the entire particle system
    mesh.current.rotation.x += 0.0005;
    mesh.current.rotation.y += 0.0003;
    
    // Pulse effect with time
    const time = state.clock.getElapsedTime();
    mesh.current.scale.set(
      1 + Math.sin(time * 0.3) * 0.05,
      1 + Math.sin(time * 0.3) * 0.05,
      1 + Math.sin(time * 0.3) * 0.05
    );
  });
  
  return (
    <Points ref={mesh} positions={particles} stride={3}>
      <pointsMaterial 
        size={size * 0.01} 
        color={color} 
        sizeAttenuation 
        transparent 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      <Point />
    </Points>
  );
};

const ParticleAnimation: React.FC<ParticleAnimationProps> = ({ 
  count = 1000, 
  className,
  color = '#3b82f6',
  size = 4
}) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <ParticleCloud count={count} color={color} size={size} />
      </Canvas>
    </div>
  );
};

export default ParticleAnimation;
