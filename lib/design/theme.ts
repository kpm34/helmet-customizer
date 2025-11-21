/**
 * Theme Utilities & Mixins
 * Reusable styling patterns based on Spline Copilot architecture
 */

import { tokens } from './tokens';
import { CSSProperties } from 'react';

/**
 * Liquid Glass Container - 4 Layer Architecture
 *
 * Layer 1: Distortion Filter (liquid texture)
 * Layer 2: Background Overlay (semi-transparent)
 * Layer 3: Specular Highlights (edge glow)
 * Layer 4: Content Wrapper
 *
 * @param variant - Size variant (sm, md, lg)
 * @returns CSS properties for glass effect
 */
export function glassContainer(variant: 'sm' | 'md' | 'lg' = 'md'): CSSProperties {
  const config = {
    sm: {
      blur: tokens.blur.md,
      padding: tokens.spacing.md,
      borderRadius: tokens.borderRadius.lg,
    },
    md: {
      blur: tokens.blur.xl,
      padding: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.xl,
    },
    lg: {
      blur: tokens.blur.xxl,
      padding: tokens.spacing.xl,
      borderRadius: tokens.borderRadius.xxl,
    },
  };

  const settings = config[variant];

  return {
    position: 'relative',
    background: tokens.colors.glass.background,
    backdropFilter: `blur(${settings.blur})`,
    WebkitBackdropFilter: `blur(${settings.blur})`,
    border: `1px solid ${tokens.colors.glass.border}`,
    borderRadius: settings.borderRadius,
    padding: settings.padding,
    boxShadow: tokens.shadows.glass.md,

    // Fallback for browsers that don't support backdrop-filter
    '@supports not (backdrop-filter: blur(0px))': {
      background: tokens.colors.surface.base,
    },
  } as CSSProperties;
}

/**
 * Transition Helper
 * Creates smooth transitions with consistent timing
 *
 * @param properties - CSS properties to transition
 * @param duration - Duration preset (fast, normal, slow)
 * @param easing - Easing function preset
 * @returns Transition CSS string
 */
export function transition(
  properties: string[] = ['all'],
  duration: keyof typeof tokens.animations.duration = 'normal',
  easing: keyof typeof tokens.animations.easing = 'easeInOut'
): CSSProperties {
  const time = tokens.animations.duration[duration];
  const curve = tokens.animations.easing[easing];

  return {
    transition: properties.map(prop => `${prop} ${time} ${curve}`).join(', '),
  } as CSSProperties;
}

/**
 * Focus Ring (WCAG 2.1 AA Compliant)
 * Accessible focus indicator for keyboard navigation
 *
 * @param color - Focus ring color (defaults to accent blue)
 * @returns CSS properties for focus state
 */
export function focusRing(color: string = tokens.colors.border.focus): CSSProperties {
  return {
    outline: `${tokens.accessibility.focusRing.width} ${tokens.accessibility.focusRing.style} ${color}`,
    outlineOffset: tokens.accessibility.focusRing.offset,
  } as CSSProperties;
}

/**
 * Custom Scrollbar (Dark Theme)
 * Styled scrollbar for dark interfaces
 * Note: Use as Tailwind classes or CSS, not inline styles
 *
 * @returns CSS properties for scrollbar styling
 */
export const scrollbarStyles = {
  // For Firefox
  scrollbarWidth: 'thin' as const,
  scrollbarColor: `${tokens.colors.border.base} ${tokens.colors.background.secondary}`,
} as CSSProperties;

/**
 * Button Base Styles
 * Common button styling with variants
 *
 * @param variant - Button variant (primary, secondary, ghost)
 * @param size - Button size (sm, md, lg)
 * @returns CSS properties for button
 */
export function buttonBase(
  variant: 'primary' | 'secondary' | 'ghost' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md'
): CSSProperties {
  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: tokens.typography.fontFamily.base,
    fontWeight: tokens.typography.fontWeight.medium,
    borderRadius: tokens.components.button.borderRadius.default,
    cursor: 'pointer',
    border: 'none',
    ...transition(['all'], 'normal', 'easeInOut'),
  };

  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      height: tokens.components.button.height.sm,
      padding: `0 ${tokens.components.button.paddingX.sm}`,
      fontSize: tokens.typography.fontSize.xs,
    },
    md: {
      height: tokens.components.button.height.md,
      padding: `0 ${tokens.components.button.paddingX.md}`,
      fontSize: tokens.typography.fontSize.sm,
    },
    lg: {
      height: tokens.components.button.height.lg,
      padding: `0 ${tokens.components.button.paddingX.lg}`,
      fontSize: tokens.typography.fontSize.base,
    },
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      background: tokens.colors.primary.gradient,
      color: tokens.colors.text.primary,
      boxShadow: tokens.shadows.md,
    },
    secondary: {
      background: tokens.colors.surface.elevated,
      color: tokens.colors.text.primary,
      border: `1px solid ${tokens.colors.border.base}`,
    },
    ghost: {
      background: 'transparent',
      color: tokens.colors.text.secondary,
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
}

/**
 * Card Base Styles
 * Common card container styling
 *
 * @param elevated - Whether card should appear elevated
 * @returns CSS properties for card
 */
export function cardBase(elevated: boolean = false): CSSProperties {
  return {
    background: elevated ? tokens.colors.surface.elevated : tokens.colors.surface.base,
    border: `1px solid ${tokens.colors.border.transparent}`,
    borderRadius: tokens.components.card.borderRadius,
    padding: tokens.components.card.padding,
    boxShadow: elevated ? tokens.shadows.md : tokens.shadows.sm,
    ...transition(['box-shadow', 'transform'], 'normal', 'easeOut'),
  };
}

/**
 * Pill Container
 * Rounded pill-shaped container for tabs and buttons
 *
 * @returns CSS properties for pill container
 */
export function pillContainer(): CSSProperties {
  return {
    display: 'flex',
    gap: tokens.spacing.xs,
    background: tokens.colors.glass.background,
    borderRadius: tokens.borderRadius.round,
    padding: tokens.spacing.xs,
    boxShadow: tokens.shadows.glass.sm,
  };
}

/**
 * Pill Button (for tabs)
 * Individual pill button styling
 *
 * @param active - Whether button is active
 * @returns CSS properties for pill button
 */
export function pillButton(active: boolean = false): CSSProperties {
  return {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    padding: `${tokens.components.tabs.paddingY} ${tokens.components.tabs.paddingX}`,
    borderRadius: tokens.borderRadius.round,
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: active ? tokens.typography.fontWeight.semibold : tokens.typography.fontWeight.medium,
    background: active ? tokens.components.tabs.activeBackground : tokens.components.tabs.inactiveBackground,
    color: active ? tokens.components.tabs.activeText : tokens.components.tabs.inactiveText,
    opacity: active ? 1 : tokens.components.tabs.inactiveOpacity,
    cursor: 'pointer',
    border: 'none',
    boxShadow: active ? tokens.shadows.glow.blue : 'none',
    ...transition(['all'], 'normal', 'easeInOut'),
  };
}

/**
 * Zone Indicator
 * Circular color indicator for helmet zones
 *
 * @param color - Zone color
 * @param size - Indicator size in pixels
 * @returns CSS properties for zone indicator
 */
export function zoneIndicator(color: string, size: number = 12): CSSProperties {
  return {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: color,
    border: `2px solid rgba(255, 255, 255, 0.3)`,
    boxShadow: `0 0 8px ${color}40`,
  };
}

/**
 * Glow Effect
 * Adds colored glow to elements
 *
 * @param color - Glow color
 * @param intensity - Glow intensity (0-1)
 * @returns CSS properties for glow effect
 */
export function glowEffect(color: string, intensity: number = 0.4): CSSProperties {
  const alpha = Math.round(intensity * 255).toString(16).padStart(2, '0');
  return {
    boxShadow: `0 0 20px ${color}${alpha}`,
  };
}

/**
 * Truncate Text
 * Truncates text with ellipsis
 *
 * @param lines - Number of lines before truncation (1 for single line)
 * @returns CSS properties for text truncation
 */
export function truncateText(lines: number = 1): CSSProperties {
  if (lines === 1) {
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
  }

  return {
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as CSSProperties;
}
