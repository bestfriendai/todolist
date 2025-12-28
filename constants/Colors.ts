/**
 * Aurora/Cosmic Color Theme
 * This file provides backwards compatibility with the original template.
 * For the full design system, use @/src/constants/theme.ts
 */

// Aurora primary colors
const primaryLight = '#8b5cf6'; // Violet
const primaryDark = '#a78bfa';  // Light violet

export default {
  light: {
    text: '#111827',
    background: '#f9fafb',
    tint: primaryLight,
    tabIconDefault: '#9ca3af',
    tabIconSelected: primaryLight,
    // Extended Aurora colors
    primary: primaryLight,
    secondary: '#06b6d4',
    accent: '#d946ef',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    card: '#ffffff',
    border: '#e5e7eb',
  },
  dark: {
    text: '#ffffff',
    background: '#0a0a1a', // Deep space black
    tint: primaryDark,
    tabIconDefault: '#6b7280',
    tabIconSelected: primaryDark,
    // Extended Aurora colors
    primary: primaryDark,
    secondary: '#22d3ee',
    accent: '#e879f9',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    card: '#111827',
    border: '#374151',
  },
};
