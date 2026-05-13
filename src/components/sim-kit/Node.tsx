import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { colors, motion as motionTokens, radii } from './tokens';

export type NodeState = 'idle' | 'active' | 'failing';

export interface NodeProps {
  label: string;
  state: NodeState;
  sublabel?: string;
  /** Decorative icon rendered above the label. Will be marked aria-hidden. */
  icon?: ReactNode;
}

const stateColor: Record<NodeState, string> = {
  idle: colors.idle,
  active: colors.active,
  failing: colors.failing,
};

export function Node({ label, state, sublabel, icon }: NodeProps) {
  return (
    <motion.div
      data-testid="sim-node"
      data-state={state}
      role="group"
      aria-label={`${label}, ${state}`}
      animate={{
        borderColor: stateColor[state],
        scale: state === 'active' ? 1.04 : 1,
      }}
      transition={motionTokens.springSnappy}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 96,
        minHeight: 56,
        padding: '0.5rem 0.75rem',
        background: colors.bg,
        border: `2px solid ${stateColor[state]}`,
        borderRadius: radii.md,
        color: colors.text,
        fontWeight: 600,
      }}
    >
      {icon && (
        <span
          aria-hidden="true"
          data-testid="sim-node-icon"
          style={{
            display: 'inline-flex',
            color: stateColor[state],
            marginBottom: 2,
          }}
        >
          {icon}
        </span>
      )}
      <span>{label}</span>
      {sublabel && (
        <span style={{ fontSize: '0.75rem', color: colors.muted, fontWeight: 400 }}>
          {sublabel}
        </span>
      )}
    </motion.div>
  );
}
