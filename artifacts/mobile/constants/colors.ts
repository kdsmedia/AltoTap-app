/**
 * AltoTap design tokens — always dark-gold theme.
 * Both light and dark modes use the same dark palette so the
 * app looks consistent regardless of device colour-scheme setting.
 */

const palette = {
  // Backgrounds
  background: '#121214',
  surface: '#1C1C1E',
  surfaceVariant: '#2C2C2E',
  surfaceHigh: '#3A3A3C',

  // Brand
  gold: '#FFD700',
  goldDark: '#C5A000',
  goldLight: '#FFE566',
  amber: '#FF9500',

  // Semantic
  green: '#34C759',
  blue: '#0A84FF',
  red: '#FF3B30',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#E5E5E7',
  textMuted: '#8E8E93',

  // Border
  border: '#3A3A3C',
};

const shared = {
  text: palette.textPrimary,
  tint: palette.gold,
  background: palette.background,
  foreground: palette.textPrimary,
  card: palette.surface,
  cardForeground: palette.textPrimary,
  primary: palette.gold,
  primaryForeground: '#000000',
  secondary: palette.surfaceVariant,
  secondaryForeground: palette.textPrimary,
  muted: palette.surfaceVariant,
  mutedForeground: palette.textMuted,
  accent: palette.amber,
  accentForeground: '#000000',
  destructive: palette.red,
  destructiveForeground: palette.textPrimary,
  border: palette.border,
  input: palette.surfaceVariant,
};

const colors = {
  light: shared,
  dark: shared,
  radius: 12,
};

export default colors;

// Named exports for direct use in components
export const COLORS = palette;
