import { colors, radii } from './tokens';

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

export interface ToggleProps<T extends string> {
  value: T;
  options: readonly ToggleOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
}

export function Toggle<T extends string>({ value, options, onChange, ariaLabel }: ToggleProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.md,
        padding: 2,
        gap: 2,
      }}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={selected}
            aria-label={opt.label}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '0.35rem 0.75rem',
              border: 0,
              borderRadius: radii.sm,
              background: selected ? colors.active : 'transparent',
              color: selected ? '#fff' : colors.text,
              cursor: 'pointer',
              fontWeight: selected ? 600 : 400,
              fontSize: '0.85rem',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
