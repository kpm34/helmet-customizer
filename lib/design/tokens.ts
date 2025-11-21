/**
 * Design Tokens System
 * Centralized design values for consistency across the application
 * Based on Spline Copilot design system patterns
 */

export const tokens = {
  /**
   * Color Palette
   */
  colors: {
    // Primary brand colors
    primary: {
      base: '#667eea',
      light: '#7c8efc',
      dark: '#5568d3',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },

    // Accent colors
    accent: {
      blue: '#87CEEB',
      cyan: '#5ba4cf',
      purple: '#764ba2',
      navy: '#001f3f',
    },

    // Background colors (dark theme)
    background: {
      primary: '#0d0d0d',
      secondary: '#1a1a1a',
      tertiary: '#1f1f1f',
      gradient: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
      gradientReverse: 'linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 100%)',
    },

    // Surface colors
    surface: {
      base: '#1a1a1a',
      elevated: '#2a2a2a',
      overlay: 'rgba(0, 0, 0, 0.5)',
      glass: 'rgba(255, 255, 255, 0.08)',
      glassHover: 'rgba(255, 255, 255, 0.12)',
    },

    // Text colors
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
      tertiary: '#a0a0a0',
      muted: '#6b7280',
      disabled: '#4b5563',
    },

    // Border colors
    border: {
      base: '#374151',
      light: '#4b5563',
      lighter: '#6b7280',
      transparent: 'rgba(255, 255, 255, 0.1)',
      focus: '#87CEEB',
    },

    // Status colors
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },

    // Glass effect colors
    glass: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.1)',
      highlight: 'rgba(255, 255, 255, 0.15)',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
  },

  /**
   * Spacing Scale (8px base)
   */
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
  },

  /**
   * Border Radius
   */
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '32px',
    round: '9999px',
  },

  /**
   * Typography
   */
  typography: {
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"Fira Code", "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      xxl: '1.5rem',    // 24px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  /**
   * Shadows
   */
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px rgba(0, 0, 0, 0.25)',

    // Colored shadows
    glow: {
      blue: '0 0 20px rgba(135, 206, 235, 0.3)',
      cyan: '0 0 20px rgba(91, 164, 207, 0.3)',
      purple: '0 0 20px rgba(118, 75, 162, 0.3)',
    },

    // Glass-specific shadows
    glass: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
      md: '0 4px 12px rgba(0, 0, 0, 0.4)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.5)',
    },
  },

  /**
   * Animations
   */
  animations: {
    duration: {
      fast: '100ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  /**
   * Z-Index Scale
   */
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 9999,
  },

  /**
   * Backdrop Blur
   */
  blur: {
    none: '0px',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '30px',
  },

  /**
   * Accessibility
   */
  accessibility: {
    focusRing: {
      width: '2px',
      offset: '2px',
      color: '#87CEEB',
      style: 'solid',
    },
    minTouchTarget: '44px',
  },

  /**
   * Component-Specific Tokens
   */
  components: {
    panel: {
      width: '384px', // w-96
      collapsedWidth: '0px',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    tabs: {
      height: '40px',
      paddingX: '12px',
      paddingY: '8px',
      borderRadius: '32px',
      activeBackground: '#87CEEB',
      activeText: '#001f3f',
      inactiveBackground: 'transparent',
      inactiveText: '#ffffff',
      inactiveOpacity: 0.6,
    },

    input: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      borderRadius: '32px',
      paddingX: '16px',
      paddingY: '12px',
    },

    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      borderRadius: {
        default: '8px',
        pill: '9999px',
        circle: '50%',
      },
      paddingX: {
        sm: '12px',
        md: '16px',
        lg: '24px',
      },
    },

    tooltip: {
      maxWidth: '250px',
      padding: '8px 12px',
      borderRadius: '6px',
      background: 'rgba(0, 0, 0, 0.9)',
      fontSize: '13px',
      offset: '8px',
    },

    card: {
      padding: '16px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },
} as const;

/**
 * Type helper for extracting token values
 */
export type DesignTokens = typeof tokens;

/**
 * Utility function to create CSS custom properties from tokens
 */
export function createCSSVariables(): Record<string, string> {
  return {
    // Colors
    '--color-primary': tokens.colors.primary.base,
    '--color-primary-light': tokens.colors.primary.light,
    '--color-primary-dark': tokens.colors.primary.dark,

    // Spacing
    '--spacing-xs': tokens.spacing.xs,
    '--spacing-sm': tokens.spacing.sm,
    '--spacing-md': tokens.spacing.md,
    '--spacing-lg': tokens.spacing.lg,
    '--spacing-xl': tokens.spacing.xl,
    '--spacing-xxl': tokens.spacing.xxl,
    '--spacing-xxxl': tokens.spacing.xxxl,

    // Border radius
    '--radius-sm': tokens.borderRadius.sm,
    '--radius-md': tokens.borderRadius.md,
    '--radius-lg': tokens.borderRadius.lg,
    '--radius-xl': tokens.borderRadius.xl,
    '--radius-xxl': tokens.borderRadius.xxl,
    '--radius-round': tokens.borderRadius.round,

    // Shadows
    '--shadow-sm': tokens.shadows.sm,
    '--shadow-base': tokens.shadows.base,
    '--shadow-md': tokens.shadows.md,
    '--shadow-lg': tokens.shadows.lg,
    '--shadow-xl': tokens.shadows.xl,
  };
}
