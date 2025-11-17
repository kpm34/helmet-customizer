'use client';

import { ReactNode, useState } from 'react';
import { tokens } from '@/lib/design/tokens';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

interface TooltipEnhancedProps {
  content: string | ReactNode;
  position?: TooltipPosition;
  children: ReactNode;
  delay?: number;
  disabled?: boolean;
}

export function TooltipEnhanced({
  content,
  position = 'top',
  children,
  delay = 200,
  disabled = false,
}: TooltipEnhancedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionStyles: Record<TooltipPosition, React.CSSProperties> = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: isVisible ? 'translateX(-50%) translateY(-8px)' : 'translateX(-50%) translateY(-4px)',
      marginBottom: '4px',
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: isVisible ? 'translateX(-50%) translateY(8px)' : 'translateX(-50%) translateY(4px)',
      marginTop: '4px',
    },
    left: {
      right: '100%',
      top: '50%',
      transform: isVisible ? 'translateY(-50%) translateX(-8px)' : 'translateY(-50%) translateX(-4px)',
      marginRight: '4px',
    },
    right: {
      left: '100%',
      top: '50%',
      transform: isVisible ? 'translateY(-50%) translateX(8px)' : 'translateY(-50%) translateX(4px)',
      marginLeft: '4px',
    },
  };

  const arrowStyles: Record<TooltipPosition, React.CSSProperties> = {
    top: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: '6px solid rgba(0, 0, 0, 0.95)',
    },
    bottom: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderBottom: '6px solid rgba(0, 0, 0, 0.95)',
    },
    left: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderLeft: '6px solid rgba(0, 0, 0, 0.95)',
    },
    right: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderRight: '6px solid rgba(0, 0, 0, 0.95)',
    },
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {!disabled && (
        <div
          className="absolute pointer-events-none transition-all duration-200"
          style={{
            ...positionStyles[position],
            opacity: isVisible ? 1 : 0,
            visibility: isVisible ? 'visible' : 'hidden',
            zIndex: tokens.zIndex.tooltip,
          }}
        >
          {/* Tooltip Content */}
          <div
            className="px-3 py-2 text-xs text-white whitespace-nowrap rounded-md shadow-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(8px)',
              maxWidth: tokens.components.tooltip.maxWidth,
              fontSize: tokens.components.tooltip.fontSize,
            }}
          >
            {content}
          </div>

          {/* Arrow */}
          <div
            className="absolute w-0 h-0"
            style={arrowStyles[position]}
          />
        </div>
      )}
    </div>
  );
}
