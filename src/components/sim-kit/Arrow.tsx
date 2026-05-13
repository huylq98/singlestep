import { motion } from 'framer-motion';
import { colors, motion as motionTokens } from './tokens';

export interface Point {
  x: number;
  y: number;
}

export interface ArrowProps {
  from: Point;
  to: Point;
  active?: boolean;
  width?: number;
  height?: number;
  label?: string;
}

export function Arrow({
  from,
  to,
  active = false,
  width = 400,
  height = 200,
  label,
}: ArrowProps) {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const stroke = active ? colors.active : colors.idle;
  const path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  return (
    <svg
      data-testid="sim-arrow"
      data-active={active}
      width={width}
      height={height}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <marker
          id="arrow-head"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={stroke} />
        </marker>
      </defs>
      <motion.path
        d={path}
        stroke={stroke}
        strokeWidth={2}
        fill="none"
        markerEnd="url(#arrow-head)"
        animate={{ opacity: active ? 1 : 0.4 }}
        transition={motionTokens.tweenFast}
      />
      {active && (
        <motion.circle
          r={4}
          fill={colors.active}
          initial={{ cx: from.x, cy: from.y }}
          animate={{ cx: to.x, cy: to.y }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      {label && (
        <text x={mid.x} y={mid.y - 6} fill={colors.muted} fontSize="11" textAnchor="middle">
          {label}
        </text>
      )}
    </svg>
  );
}
