'use client';

import { motion } from 'framer-motion';

interface RotatingBorderProps {
  children: React.ReactNode;
  borderColor?: string;
  animationDuration?: number;
  blurRadius?: number;
  borderRadius?: number;
  backgroundColor?: string;
  overlayMargin?: number;
  isActive?: boolean;
}

export function RotatingBorder({
  children,
  borderColor = '#3B82F6',
  animationDuration = 3,
  blurRadius = 2,
  borderRadius = 8,
  backgroundColor = 'transparent',
  overlayMargin = 1,
  isActive = false,
}: RotatingBorderProps) {
  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: `${borderRadius}px`,
      }}
    >
      {/* Rotating border using conic gradient */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-450%',
          left: 0,
          right: 0,
          bottom: 0,
          height: '1000%',
          background: `conic-gradient(transparent 200deg, ${borderColor})`,
          borderRadius: `${borderRadius}px`,
          zIndex: 1,
        }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: animationDuration,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 0,
        }}
      />

      {/* Blurred overlay with border */}
      <div
        style={{
          position: 'absolute',
          top: `${overlayMargin}px`,
          left: `${overlayMargin}px`,
          right: `${overlayMargin}px`,
          bottom: `${overlayMargin}px`,
          backdropFilter: `blur(${blurRadius}px)`,
          backgroundColor: backgroundColor,
          borderRadius: `${Math.max(0, borderRadius - overlayMargin)}px`,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}
