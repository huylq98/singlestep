import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EventLog, type LogEntry } from './EventLog';

describe('<EventLog>', () => {
  it('renders entries newest-first with timestamps and messages', () => {
    const entries: LogEntry[] = [
      { id: '1', timestamp: '12:01:03', message: 'GET key1 → replica-2', kind: 'info' },
      { id: '2', timestamp: '12:01:04', message: 'SET key3 → master',     kind: 'success' },
    ];
    render(<EventLog entries={entries} />);
    expect(screen.getByText('GET key1 → replica-2')).toBeInTheDocument();
    expect(screen.getByText('SET key3 → master')).toBeInTheDocument();
  });

  it('renders an empty-state when there are no entries', () => {
    render(<EventLog entries={[]} />);
    expect(screen.getByText(/no events yet/i)).toBeInTheDocument();
  });
});
