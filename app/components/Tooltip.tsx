/**
 * Tooltip Component
 * Mimics the Spline Copilot tooltip hover animation
 */

import React from 'react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

export function Tooltip({ content, position = 'right', children }: TooltipProps) {
  return (
    <div className="tooltip-wrapper">
      {children}
      <span className={`tooltip tooltip-${position}`}>
        {content}
      </span>
      <style jsx>{`
        .tooltip-wrapper {
          position: relative;
          display: inline-block;
        }

        .tooltip {
          position: absolute;
          border-radius: 2px;
          background: rgba(0, 0, 0, 0.85);
          color: white;
          font-size: 13px;
          padding: 4px 10px 5px;
          white-space: nowrap;
          font-family: sans-serif;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 9999;
        }

        /* Position variants */
        .tooltip-right {
          left: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%) translateX(-5px);
        }

        .tooltip-left {
          right: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%) translateX(5px);
        }

        .tooltip-top {
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) translateY(5px);
        }

        .tooltip-bottom {
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) translateY(-5px);
        }

        /* Hover effects */
        .tooltip-wrapper:hover .tooltip-right {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        .tooltip-wrapper:hover .tooltip-left {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        .tooltip-wrapper:hover .tooltip-top {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .tooltip-wrapper:hover .tooltip-bottom {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `}</style>
    </div>
  );
}
