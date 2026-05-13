import { colors } from './tokens';

export interface LegendItem {
  color: string;
  label: string;
}

export interface LegendProps {
  items: readonly LegendItem[];
}

export function Legend({ items }: LegendProps) {
  return (
    <ul
      aria-label="Legend"
      style={{
        display: 'flex',
        gap: '1rem',
        listStyle: 'none',
        padding: 0,
        margin: '0.75rem 0 0',
        fontSize: '0.75rem',
        color: colors.muted,
      }}
    >
      {items.map((item) => (
        <li key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: item.color,
              display: 'inline-block',
            }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
