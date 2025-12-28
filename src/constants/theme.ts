import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// COLOR PALETTE - Aurora/Cosmic Theme
// ============================================
export const colors = {
  // Primary - Violet/Purple (Aurora)
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6', // Main
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },

  // Secondary - Cyan/Teal (Aurora accent)
  secondary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4', // Main
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Accent - Pink/Magenta (Aurora glow)
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef', // Main
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },

  // Neutral - Dark cosmic backgrounds
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#0a0a1a', // Deep space black
  },

  // Semantic colors
  success: {
    light: '#4ade80',
    main: '#22c55e',
    dark: '#16a34a',
  },
  warning: {
    light: '#fbbf24',
    main: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#f87171',
    main: '#ef4444',
    dark: '#dc2626',
  },
  info: {
    light: '#60a5fa',
    main: '#3b82f6',
    dark: '#2563eb',
  },

  // Base colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Gradients (as array for LinearGradient)
  gradients: {
    aurora: ['#8b5cf6', '#06b6d4', '#d946ef'],
    auroraVertical: ['#0a0a1a', '#1a1a3a', '#0a0a1a'],
    cosmic: ['#4c1d95', '#0e7490', '#701a75'],
    sunset: ['#f97316', '#ec4899', '#8b5cf6'],
    ocean: ['#0ea5e9', '#06b6d4', '#8b5cf6'],
    card: ['rgba(139, 92, 246, 0.1)', 'rgba(6, 182, 212, 0.05)'],
  },
} as const;

// ============================================
// SPACING SYSTEM (8px base)
// ============================================
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
  '7xl': 96,
} as const;

// ============================================
// TYPOGRAPHY SCALE
// ============================================
export const typography = {
  fonts: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    semibold: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
    mono: 'SpaceMono',
  },
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 30,
    '5xl': 36,
    '6xl': 48,
    '7xl': 60,
  },
  lineHeights: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;

// ============================================
// BORDER RADIUS
// ============================================
export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// ============================================
// SHADOWS / ELEVATION
// ============================================
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: (color: string = colors.primary[500]) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }),
} as const;

// ============================================
// ANIMATION TOKENS
// ============================================
export const animation = {
  duration: {
    instant: 50,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700,
  },
  spring: {
    gentle: { damping: 20, stiffness: 100 },
    bouncy: { damping: 10, stiffness: 150 },
    stiff: { damping: 30, stiffness: 300 },
    slow: { damping: 20, stiffness: 50 },
  },
} as const;

// ============================================
// LAYOUT
// ============================================
export const layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  headerHeight: Platform.OS === 'ios' ? 44 : 56,
  tabBarHeight: Platform.OS === 'ios' ? 88 : 68,
  maxContentWidth: 600,
  containerPadding: spacing.lg,
} as const;

// ============================================
// Z-INDEX
// ============================================
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70,
} as const;

// ============================================
// REACT NAVIGATION THEME
// ============================================
export const AuroraTheme = {
  dark: true,
  colors: {
    primary: colors.primary[500],
    background: colors.gray[950],
    card: colors.gray[900],
    text: colors.white,
    border: colors.gray[800],
    notification: colors.accent[500],
  },
};

// ============================================
// COMPONENT VARIANTS
// ============================================
export const buttonVariants = {
  primary: {
    backgroundColor: colors.primary[500],
    textColor: colors.white,
    pressedBackgroundColor: colors.primary[600],
  },
  secondary: {
    backgroundColor: colors.gray[800],
    textColor: colors.white,
    pressedBackgroundColor: colors.gray[700],
  },
  outline: {
    backgroundColor: 'transparent',
    textColor: colors.primary[500],
    borderColor: colors.primary[500],
    pressedBackgroundColor: colors.primary[500] + '20',
  },
  ghost: {
    backgroundColor: 'transparent',
    textColor: colors.primary[500],
    pressedBackgroundColor: colors.primary[500] + '10',
  },
  danger: {
    backgroundColor: colors.error.main,
    textColor: colors.white,
    pressedBackgroundColor: colors.error.dark,
  },
} as const;

export const inputVariants = {
  default: {
    backgroundColor: colors.gray[900],
    borderColor: colors.gray[700],
    focusBorderColor: colors.primary[500],
    textColor: colors.white,
    placeholderColor: colors.gray[500],
  },
  error: {
    backgroundColor: colors.gray[900],
    borderColor: colors.error.main,
    focusBorderColor: colors.error.main,
    textColor: colors.white,
    placeholderColor: colors.gray[500],
  },
} as const;

// Priority colors
export const priorityColors = {
  low: colors.success.main,
  medium: colors.warning.main,
  high: colors.error.main,
} as const;

// Category default colors
export const categoryColors = [
  colors.primary[500],
  colors.secondary[500],
  colors.accent[500],
  colors.success.main,
  colors.warning.main,
  colors.error.main,
  colors.info.main,
  '#f472b6', // pink
  '#a78bfa', // violet
  '#34d399', // emerald
] as const;

// Export everything as default theme object
const theme = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  animation,
  layout,
  zIndex,
  buttonVariants,
  inputVariants,
  priorityColors,
  categoryColors,
};

export default theme;
