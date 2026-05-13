import type { ReactNode } from 'react';
import { colors, radii } from './tokens';

export interface StepButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export function StepButton({
  onClick,
  disabled,
  variant = 'primary',
  children,
}: StepButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.4rem 0.9rem',
        border: isPrimary ? 0 : `1px solid ${colors.border}`,
        borderRadius: radii.md,
        background: isPrimary ? colors.active : 'transparent',
        color: isPrimary ? '#fff' : colors.text,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontWeight: 600,
        fontSize: '0.85rem',
      }}
    >
      {children}
    </button>
  );
}
