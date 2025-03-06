
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const ThreeDCard: React.FC<ThreeDCardProps> = ({ 
  children, 
  className,
  intensity = 15 
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Scale rotation based on intensity (smaller number = more rotation)
    const rotateX = y / (intensity * 2); 
    const rotateY = -x / (intensity * 2);
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  // Dynamic styles based on hover state and rotation
  const cardStyle = {
    transform: isHovered
      ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.05, 1.05, 1.05)`
      : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
    transition: isHovered
      ? 'transform 0.1s ease'
      : 'transform 0.5s ease'
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        "bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 rounded-xl overflow-hidden shadow-lg border border-zinc-800/50 relative",
        className
      )}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Reflective highlight effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"
        style={{
          transform: isHovered
            ? `translateX(${rotate.y * 20}px) translateY(${-rotate.x * 20}px)`
            : 'translateX(0) translateY(0)',
          opacity: isHovered ? 0.4 : 0,
          transition: 'transform 0.1s ease, opacity 0.3s ease'
        }}
      />
      
      {children}
    </div>
  );
};

export default ThreeDCard;
