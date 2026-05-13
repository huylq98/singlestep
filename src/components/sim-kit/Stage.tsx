import type { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { colors, radii } from './tokens';

export interface StageProps {
  label?: string;
  children: ReactNode;
}

// MotionConfig with `reducedMotion="user"` makes every Framer Motion animation
// inside the stage honor the user's prefers-reduced-motion OS setting — no
// per-primitive opt-in needed.
export function Stage({ label = 'Simulation', children }: StageProps) {
  return (
    <section
      role="region"
      aria-label={label}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.lg,
        padding: '1.25rem',
        margin: '1.5rem 0',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </section>
  );
}
