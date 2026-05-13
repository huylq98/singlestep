// Shared design tokens for the sim-kit.
// All primitives read from here so visual language stays consistent.

export const colors = {
  // Semantic
  bg:       'var(--ifm-background-color)',
  surface:  'var(--ifm-color-emphasis-100)',
  border:   'var(--ifm-color-emphasis-300)',
  text:     'var(--ifm-font-color-base)',
  muted:    'var(--ifm-color-emphasis-600)',

  // State
  // Using fixed hex values for state colors so they stay vivid regardless of
  // theme. The Docusaurus emphasis-400 token was too pale, making idle nodes
  // look ghost-like; slate-500 reads clearly in both light and dark mode.
  idle:     '#64748b',   // slate-500
  active:   '#2563eb',   // blue-600 — more saturated than --ifm-color-primary default
  success:  '#16a34a',
  warning:  '#d97706',
  failing:  '#dc2626',
} as const;

export const motion = {
  // Framer Motion spring presets
  springSnappy: { type: 'spring' as const, stiffness: 500, damping: 30 },
  springGentle: { type: 'spring' as const, stiffness: 180, damping: 22 },
  tweenFast:    { duration: 0.2, ease: 'easeOut' as const },
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;
