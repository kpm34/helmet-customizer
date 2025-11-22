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
  borderColor = '#60A5FA',
  animationDuration = 2,
  blurRadius = 2,
  borderRadius = 12,
  backgroundColor = 'rgba(156, 163, 175, 1)', // gray-400 equivalent
  overlayMargin = 2,
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
      {/* Rotating border using conic gradient - EXACT match to example */}
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

      {/* Combined blurred overlay with border - EXACT match to example */}
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
