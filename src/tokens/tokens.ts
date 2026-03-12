export const tokens = {
  colors: {
    bg: 'rgb(var(--color-bg))',
    surface: 'rgb(var(--color-surface))',
    surface2: 'rgb(var(--color-surface-2))',
    text: 'rgb(var(--color-text))',
    muted: 'rgb(var(--color-muted))',
    border: 'rgb(var(--color-border))',

    accent: 'rgb(var(--color-accent))',
    success: 'rgb(var(--color-success))',
    warning: 'rgb(var(--color-warning))',
    danger: 'rgb(var(--color-danger))',
  },
  radii: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
  },
  space: {
    1: 'var(--space-1)',
    2: 'var(--space-2)',
    3: 'var(--space-3)',
    4: 'var(--space-4)',
    5: 'var(--space-5)',
    6: 'var(--space-6)',
    8: 'var(--space-8)',
    10: 'var(--space-10)',
    12: 'var(--space-12)',
  },
  fontSize: {
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    '2xl': 'var(--text-2xl)',
  },
  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
  },
} as const
