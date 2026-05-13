import { colors } from './tokens';

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
}

export function Slider({ value, min, max, step = 1, onChange, label }: SliderProps) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: colors.text,
        fontSize: '0.85rem',
      }}
    >
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span style={{ minWidth: 24, textAlign: 'right', fontWeight: 600 }}>{value}</span>
    </label>
  );
}
