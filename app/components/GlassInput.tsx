'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { tokens } from '@/lib/design/tokens';
import { Upload, Send } from 'lucide-react';

interface LiquidGlassInputProps {
  type?: 'text' | 'file';
  placeholder?: string;
  onSubmit?: (value: string | File) => void;
  accept?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function GlassInput({
  type = 'text',
  placeholder = 'Enter command...',
  onSubmit,
  accept,
  disabled = false,
  icon,
}: LiquidGlassInputProps) {
  const [value, setValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (disabled) return;

    if (type === 'text' && value.trim() && onSubmit) {
      onSubmit(value);
      setValue('');
    } else if (type === 'file' && selectedFile && onSubmit) {
      onSubmit(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue(file.name);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      {/* 4-Layer Liquid Glass Architecture */}
      <div
        className="relative rounded-[32px] transition-all duration-300"
        style={{
          background: tokens.colors.glass.background,
          backdropFilter: `blur(${tokens.blur.xxl})`,
          WebkitBackdropFilter: `blur(${tokens.blur.xxl})`,
          border: `1px solid ${isFocused ? tokens.colors.border.focus : tokens.colors.glass.border}`,
          boxShadow: isFocused
            ? `0 0 24px ${tokens.colors.accent.blue}30, ${tokens.shadows.glass.md}`
            : tokens.shadows.glass.md,
        }}
      >
        {/* Layer 1: Distortion filter (liquid texture) */}
        <div
          className="absolute inset-0 rounded-[32px] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
          }}
        />

        {/* Layer 2: Background overlay */}
        <div
          className="absolute inset-0 rounded-[32px] pointer-events-none"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
          }}
        />

        {/* Layer 3: Specular highlights (edge glow) */}
        <div
          className="absolute inset-0 rounded-[32px] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />

        {/* Layer 4: Content wrapper */}
        <div className="relative flex items-center gap-2 px-4 py-3">
          {/* Icon or File Input */}
          {type === 'file' ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
              />
              <button
                onClick={handleFileButtonClick}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                disabled={disabled}
                aria-label="Upload file"
              >
                <Upload className="w-5 h-5 text-gray-300" />
              </button>
            </>
          ) : (
            icon && (
              <div className="flex items-center justify-center text-gray-400">
                {icon}
              </div>
            )
          )}

          {/* Text Input */}
          {type === 'text' ? (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-gray-200 placeholder-gray-500"
              style={{
                fontFamily: tokens.typography.fontFamily.base,
                minHeight: '24px',
                maxHeight: '120px',
              }}
            />
          ) : (
            <div className="flex-1 text-sm text-gray-200 truncate">
              {selectedFile ? selectedFile.name : placeholder}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={disabled || (type === 'text' ? !value.trim() : !selectedFile)}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: disabled || (type === 'text' ? !value.trim() : !selectedFile)
                ? tokens.colors.surface.elevated
                : tokens.colors.accent.blue,
              boxShadow: disabled || (type === 'text' ? !value.trim() : !selectedFile)
                ? 'none'
                : `0 0 16px ${tokens.colors.accent.blue}60`,
            }}
            aria-label="Submit"
          >
            {type === 'file' ? (
              <Upload className="w-5 h-5 text-white" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Focus Ring (WCAG) */}
      {isFocused && (
        <div
          className="absolute inset-0 rounded-[32px] pointer-events-none"
          style={{
            outline: `${tokens.accessibility.focusRing.width} ${tokens.accessibility.focusRing.style} ${tokens.accessibility.focusRing.color}`,
            outlineOffset: tokens.accessibility.focusRing.offset,
          }}
        />
      )}
    </div>
  );
}
