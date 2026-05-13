import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RedisReadMode } from './RedisReadMode';

describe('<RedisReadMode>', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(()  => { vi.useRealTimers(); });

  it('renders the master and both replicas with mode toggle', () => {
    render(<RedisReadMode initialMode="master" />);
    expect(screen.getByText('Master')).toBeInTheDocument();
    expect(screen.getByText('Replica 1')).toBeInTheDocument();
    expect(screen.getByText('Replica 2')).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: /read mode/i })).toBeInTheDocument();
  });

  it('routes a GET to master when mode is master', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RedisReadMode initialMode="master" />);
    await user.click(screen.getByRole('button', { name: /send get/i }));
    act(() => { vi.advanceTimersByTime(800); });
    expect(screen.getByLabelText(/event log/i).textContent).toMatch(/master/i);
  });

  it('routes a GET to a replica when mode is replica', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RedisReadMode initialMode="replica" />);
    await user.click(screen.getByRole('button', { name: /send get/i }));
    act(() => { vi.advanceTimersByTime(800); });
    expect(screen.getByLabelText(/event log/i).textContent).toMatch(/replica/i);
  });

  it('reset clears the event log', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RedisReadMode initialMode="master" />);
    await user.click(screen.getByRole('button', { name: /send get/i }));
    act(() => { vi.advanceTimersByTime(800); });
    await user.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.getByLabelText(/event log/i).textContent).toMatch(/no events yet/i);
  });
});
