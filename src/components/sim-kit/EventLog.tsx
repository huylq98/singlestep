import { AnimatePresence, motion } from 'framer-motion';
import { colors, radii, motion as motionTokens } from './tokens';

export type LogKind = 'info' | 'success' | 'warning' | 'error';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  kind: LogKind;
}

export interface EventLogProps {
  entries: readonly LogEntry[];
  maxHeight?: number;
}

const kindColor: Record<LogKind, string> = {
  info:    colors.muted,
  success: colors.success,
  warning: colors.warning,
  error:   colors.failing,
};

export function EventLog({ entries, maxHeight = 180 }: EventLogProps) {
  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Event log"
      style={{
        marginTop: '0.75rem',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.md,
        padding: '0.5rem 0.75rem',
        maxHeight,
        overflowY: 'auto',
        fontFamily: 'var(--ifm-font-family-monospace)',
        fontSize: '0.8rem',
        color: colors.text,
      }}
    >
      {entries.length === 0 ? (
        <span style={{ color: colors.muted }}>No events yet. Interact with the simulation above.</span>
      ) : (
        <AnimatePresence initial={false}>
          {entries.map((e) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={motionTokens.tweenFast}
              style={{ padding: '2px 0' }}
            >
              <span style={{ color: colors.muted, marginRight: 8 }}>{e.timestamp}</span>
              <span style={{ color: kindColor[e.kind] }}>{e.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
