
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Ring } from '@react-three/drei';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg' | undefined;

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const SpinnerRing = ({ size }: { size: number }) => {
  return (
    <Ring args={[size, size*1.5, 30]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial 
        color="#3b82f6" 
        roughness={0.5} 
        metalness={0.8} 
        emissive="#3b82f6"
        emissiveIntensity={0.2}
        side={2}
      />
    </Ring>
  );
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-32 w-32'
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={`relative ${sizeClasses[size]}`}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <SpinnerRing size={0.8} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={5} 
          />
        </Canvas>
      </div>
    </div>
  );
};
