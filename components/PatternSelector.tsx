'use client';

import { PATTERN_OPTIONS, PatternOption } from '@/lib/helmet-config';
import Image from 'next/image';

interface PatternSelectorProps {
  label: string;
  value: string;
  onChange: (pattern: string) => void;
}

export default function PatternSelector({ label, value, onChange }: PatternSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="grid grid-cols-3 gap-3">
        {PATTERN_OPTIONS.map((pattern: PatternOption) => {
          const isSelected = value === pattern.id;

          return (
            <button
              key={pattern.id}
              onClick={() => onChange(pattern.id)}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Pattern preview */}
              <div className="aspect-square mb-2 rounded-md overflow-hidden bg-gray-100 relative">
                {pattern.id === 'none' ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    <Image
                      src={pattern.texturePath}
                      alt={pattern.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100px, 150px"
                    />
                  </div>
                )}
              </div>

              {/* Pattern name */}
              <div className="text-xs font-medium text-center text-gray-700">
                {pattern.name}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info text */}
      <p className="text-xs text-gray-500 mt-2">
        Pattern will overlay on the shell only
      </p>
    </div>
  );
}
