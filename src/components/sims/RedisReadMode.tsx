import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import {
  Stage,
  Node,
  Toggle,
  StepButton,
  Legend,
  EventLog,
  colors,
  motion as motionTokens,
  MonitorIcon,
  RedisIcon,
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

interface NodePositions {
  client: { x: number; y: number };
  master: { x: number; y: number };
  r1: { x: number; y: number };
  r2: { x: number; y: number };
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

  // Compute arrow endpoints from the actual rendered positions of each node so
  // arrows always connect App's right edge to each Redis node's left edge,
  // no matter the viewport width or node label widths.
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const masterRef = useRef<HTMLDivElement>(null);
  const r1Ref = useRef<HTMLDivElement>(null);
  const r2Ref = useRef<HTMLDivElement>(null);

  const [positions, setPositions] = useState<NodePositions | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const container = containerRef.current;
      const app = appRef.current;
      const master = masterRef.current;
      const r1 = r1Ref.current;
      const r2 = r2Ref.current;
      if (!container || !app || !master || !r1 || !r2) return;

      const c = container.getBoundingClientRect();
      // Use right edge for the source node, left edge for the targets — this
      // makes the arrow start where App ends and end where each Redis begins.
      const rightOf = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return {
          x: ((r.right - c.left) / c.width) * 100,
          y: ((r.top + r.bottom) / 2 - c.top) / c.height * 100,
        };
      };
      const leftOf = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return {
          x: ((r.left - c.left) / c.width) * 100,
          y: ((r.top + r.bottom) / 2 - c.top) / c.height * 100,
        };
      };
      setPositions({
        client: rightOf(app),
        master: leftOf(master),
        r1: leftOf(r1),
        r2: leftOf(r2),
      });
    };

    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <Stage label="Redis read modes — interactive simulation">
      {/*
       * Layout: two-column grid. App on the left, Redis nodes stacked on the right.
       * Arrows are drawn in an SVG overlay using viewBox (0-100 × 0-100). Their
       * endpoints are computed at runtime from the actual node positions, so they
       * always touch the right edge of App and the left edge of each Redis node.
       */}
      <div ref={containerRef} style={{ position: 'relative', minHeight: 260, marginBottom: '0.5rem' }}>
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
          {positions && (
            <>
              <ArrowLine
                fromX={positions.client.x} fromY={positions.client.y}
                toX={positions.master.x}   toY={positions.master.y}
                active={state.active === 'master'}
              />
              <ArrowLine
                fromX={positions.client.x} fromY={positions.client.y}
                toX={positions.r1.x}        toY={positions.r1.y}
                active={state.active === 'r1'}
              />
              <ArrowLine
                fromX={positions.client.x} fromY={positions.client.y}
                toX={positions.r2.x}        toY={positions.r2.y}
                active={state.active === 'r2'}
              />
            </>
          )}
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
          {/* Left column: App (client) */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div ref={appRef} style={{ display: 'inline-block' }}>
              <Node
                label="App"
                state="idle"
                sublabel="your application"
                icon={<MonitorIcon />}
              />
            </div>
          </div>

          {/* Right column: Redis Master + Replicas stacked */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              alignItems: 'flex-start',
            }}
          >
            <div ref={masterRef} style={{ display: 'inline-block' }}>
              <Node
                label="Redis Master"
                state={state.active === 'master' ? 'active' : 'idle'}
                sublabel="primary node · writes"
                icon={<RedisIcon />}
              />
            </div>
            <div ref={r1Ref} style={{ display: 'inline-block' }}>
              <Node
                label="Redis Replica 1"
                state={state.active === 'r1' ? 'active' : 'idle'}
                sublabel="read-only node"
                icon={<RedisIcon />}
              />
            </div>
            <div ref={r2Ref} style={{ display: 'inline-block' }}>
              <Node
                label="Redis Replica 2"
                state={state.active === 'r2' ? 'active' : 'idle'}
                sublabel="read-only node"
                icon={<RedisIcon />}
              />
            </div>
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
