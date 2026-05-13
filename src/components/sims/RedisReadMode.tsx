import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  Stage,
  Node,
  Toggle,
  StepButton,
  Legend,
  EventLog,
  colors,
  motion as motionTokens,
  type LogEntry,
} from '@site/src/components/sim-kit';
import { motion } from 'framer-motion';

type Mode = 'master' | 'replica' | 'replica-preferred';
type Target = 'master' | 'r1' | 'r2';

interface State {
  mode: Mode;
  active: Target | null;
  autoFire: boolean;
  events: LogEntry[];
  reqCounter: number;
}

type Action =
  | { type: 'set-mode'; mode: Mode }
  | { type: 'fire' }
  | { type: 'settle' }
  | { type: 'toggle-auto' }
  | { type: 'reset' };

const initial: State = {
  mode: 'master',
  active: null,
  autoFire: false,
  events: [],
  reqCounter: 0,
};

function pickTarget(mode: Mode, counter: number): Target {
  if (mode === 'master') return 'master';
  // 'replica' or 'replica-preferred' — alternate between replicas.
  return counter % 2 === 0 ? 'r1' : 'r2';
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'set-mode':
      return { ...state, mode: action.mode };
    case 'fire': {
      const target = pickTarget(state.mode, state.reqCounter);
      const ts = new Date().toLocaleTimeString('en-GB');
      const label =
        target === 'master' ? 'master' : target === 'r1' ? 'replica-1' : 'replica-2';
      const entry: LogEntry = {
        id: `${state.reqCounter}-${ts}`,
        timestamp: ts,
        message: `GET key${state.reqCounter} → ${label}`,
        kind: target === 'master' ? 'info' : 'success',
      };
      return {
        ...state,
        active: target,
        reqCounter: state.reqCounter + 1,
        events: [entry, ...state.events].slice(0, 50),
      };
    }
    case 'settle':
      return { ...state, active: null };
    case 'toggle-auto':
      return { ...state, autoFire: !state.autoFire };
    case 'reset':
      return { ...initial, mode: state.mode };
  }
}

export interface RedisReadModeProps {
  initialMode?: Mode;
  autoFireMs?: number;
}

// ArrowLine renders an SVG line in viewBox (0-100, 0-100) space.
// The SVG itself is positioned as an absolute overlay that covers the entire
// grid cell, so coordinates are percentages of the bounding box.
interface ArrowLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  active: boolean;
  label?: string;
}

function ArrowLine({ fromX, fromY, toX, toY, active, label }: ArrowLineProps) {
  const stroke = active ? colors.active : colors.idle;
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const markerId = `arrowhead-${active ? 'active' : 'idle'}`;

  return (
    <>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={stroke} />
        </marker>
      </defs>
      <motion.line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={stroke}
        strokeWidth={1.5}
        markerEnd={`url(#${markerId})`}
        animate={{ opacity: active ? 1 : 0.35 }}
        transition={motionTokens.tweenFast}
      />
      {active && (
        <motion.circle
          r={2.5}
          fill={colors.active}
          initial={{ cx: fromX, cy: fromY }}
          animate={{ cx: toX, cy: toY }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      {label && (
        <text
          x={midX}
          y={midY - 2}
          fill={colors.muted}
          fontSize="6"
          textAnchor="middle"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {label}
        </text>
      )}
    </>
  );
}

export function RedisReadMode({
  initialMode = 'master',
  autoFireMs = 1500,
}: RedisReadModeProps) {
  const [state, dispatch] = useReducer(reducer, { ...initial, mode: initialMode });
  const settleTimer = useRef<number | null>(null);

  const fire = useCallback(() => {
    dispatch({ type: 'fire' });
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => dispatch({ type: 'settle' }), 700);
  }, []);

  useEffect(() => {
    if (!state.autoFire) return;
    const id = window.setInterval(fire, autoFireMs);
    return () => window.clearInterval(id);
  }, [state.autoFire, autoFireMs, fire]);

  useEffect(() => () => { if (settleTimer.current) window.clearTimeout(settleTimer.current); }, []);

  // ViewBox coordinates (0-100 × 0-100). Client centred on the left, backends stacked on the right.
  const clientCenter = { x: 20, y: 50 };
  const masterCenter = { x: 82, y: 20 };
  const r1Center     = { x: 82, y: 50 };
  const r2Center     = { x: 82, y: 80 };

  return (
    <Stage label="Redis read modes — interactive simulation">
      {/*
       * Layout: two-column grid. Client on the left, servers stacked on the right.
       * Arrows are drawn in a scalable SVG overlay using viewBox (0-100 × 0-100)
       * so they scale with the container rather than using fixed pixel coords.
       */}
      <div style={{ position: 'relative', minHeight: 260, marginBottom: '0.5rem' }}>
        {/* Scalable arrow overlay */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <ArrowLine
            fromX={clientCenter.x} fromY={clientCenter.y}
            toX={masterCenter.x}  toY={masterCenter.y}
            active={state.active === 'master'}
            label="to master"
          />
          <ArrowLine
            fromX={clientCenter.x} fromY={clientCenter.y}
            toX={r1Center.x}       toY={r1Center.y}
            active={state.active === 'r1'}
            label="to r1"
          />
          <ArrowLine
            fromX={clientCenter.x} fromY={clientCenter.y}
            toX={r2Center.x}       toY={r2Center.y}
            active={state.active === 'r2'}
            label="to r2"
          />
        </svg>

        {/* Node grid — sits above the SVG overlay */}
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            gap: '0.75rem',
            minHeight: 260,
            zIndex: 1,
          }}
        >
          {/* Left column: Client */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Node label="Client" state="idle" />
          </div>

          {/* Right column: Master + Replicas stacked */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              alignItems: 'flex-start',
            }}
          >
            <Node
              label="Master"
              state={state.active === 'master' ? 'active' : 'idle'}
              sublabel="primary"
            />
            <Node
              label="Replica 1"
              state={state.active === 'r1' ? 'active' : 'idle'}
              sublabel="read replica"
            />
            <Node
              label="Replica 2"
              state={state.active === 'r2' ? 'active' : 'idle'}
              sublabel="read replica"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <Toggle
          ariaLabel="Read mode"
          value={state.mode}
          onChange={(m) => dispatch({ type: 'set-mode', mode: m })}
          options={[
            { value: 'master',            label: 'master' },
            { value: 'replica',           label: 'replica' },
            { value: 'replica-preferred', label: 'replica-preferred' },
          ]}
        />
        <StepButton onClick={fire}>Send GET</StepButton>
        <StepButton onClick={() => dispatch({ type: 'toggle-auto' })} variant="secondary">
          {state.autoFire ? 'Stop auto-fire' : `Auto-fire ${autoFireMs}ms`}
        </StepButton>
        <StepButton onClick={() => dispatch({ type: 'reset' })} variant="secondary">Reset</StepButton>
      </div>

      <Legend
        items={[
          { color: colors.idle,   label: 'idle' },
          { color: colors.active, label: 'serving request' },
        ]}
      />

      <EventLog entries={state.events} />
    </Stage>
  );
}
