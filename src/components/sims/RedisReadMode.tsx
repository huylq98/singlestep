import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  Stage,
  Node,
  Arrow,
  Toggle,
  StepButton,
  Legend,
  EventLog,
  colors,
  type LogEntry,
} from '@site/src/components/sim-kit';

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

  // Geometry for the arrows layer. Client on the left, backends on the right.
  const layer = { width: 460, height: 220 };
  const client  = { x: 60,  y: 110 };
  const master  = { x: 380, y: 50  };
  const r1      = { x: 380, y: 130 };
  const r2      = { x: 380, y: 210 };

  return (
    <Stage label="Redis read modes — interactive simulation">
      <div style={{ position: 'relative', height: layer.height, marginBottom: '0.5rem' }}>
        <Arrow from={client} to={master} active={state.active === 'master'} width={layer.width} height={layer.height} label="to master" />
        <Arrow from={client} to={r1}     active={state.active === 'r1'}     width={layer.width} height={layer.height} label="to r1" />
        <Arrow from={client} to={r2}     active={state.active === 'r2'}     width={layer.width} height={layer.height} label="to r2" />

        <div style={{ position: 'absolute', left: client.x - 50, top: client.y - 28 }}>
          <Node label="Client" state="idle" />
        </div>
        <div style={{ position: 'absolute', left: master.x - 50, top: master.y - 28 }}>
          <Node label="Master" state={state.active === 'master' ? 'active' : 'idle'} sublabel="primary" />
        </div>
        <div style={{ position: 'absolute', left: r1.x - 50, top: r1.y - 28 }}>
          <Node label="Replica 1" state={state.active === 'r1' ? 'active' : 'idle'} sublabel="read replica" />
        </div>
        <div style={{ position: 'absolute', left: r2.x - 50, top: r2.y - 28 }}>
          <Node label="Replica 2" state={state.active === 'r2' ? 'active' : 'idle'} sublabel="read replica" />
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
