'use client';

import { Check } from 'lucide-react';
import type { Pattern } from '@/lib/constants';

interface CircularPatternThumbnailProps {
  pattern: Pattern;
  size?: 'small' | 'large'; // 80px or 120px
  selected?: boolean;
  onClick: () => void;
}

export function CircularPatternThumbnail({
  pattern,
  size = 'small',
  selected = false,
  onClick,
}: CircularPatternThumbnailProps) {
  const thumbnail = size === 'small' ? pattern.thumbnail80 : pattern.thumbnail120 || pattern.thumbnail80;
  const sizeClasses = size === 'small' ? 'w-20 h-20' : 'w-30 h-30';

  return (
    <button
      onClick={onClick}
      disabled={!pattern.available}
      className="group relative flex flex-col items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      title={pattern.description}
    >
      {/* Circular thumbnail */}
      <div
        className={`
          relative aspect-square rounded-full overflow-hidden
          border-3 transition-all duration-200
          ${sizeClasses}
          ${
            selected
              ? 'border-blue-400 ring-4 ring-blue-500/30 shadow-2xl shadow-blue-400/60'
              : 'border-gray-700 ring-2 ring-white/10 shadow-lg shadow-gray-900/50'
          }
          ${
            !pattern.available
              ? 'grayscale opacity-40'
              : 'group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/30 group-hover:border-blue-400/50'
          }
        `}
        style={{
          backgroundImage: thumbnail ? `url(${thumbnail})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: !thumbnail ? '#374151' : undefined,
        }}
      >
        {/* Selected checkmark badge */}
        {selected && pattern.available && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        )}

        {/* Coming Soon overlay */}
        {!pattern.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
            <span className="text-xs font-semibold text-gray-400 px-2 py-1 bg-gray-800 rounded">
              Soon
            </span>
          </div>
        )}
      </div>

      {/* Pattern name label */}
      <div className="text-center">
        <div className="text-xs font-medium text-gray-300 max-w-[100px] truncate">
          {pattern.name}
        </div>
      </div>
    </button>
  );
}
