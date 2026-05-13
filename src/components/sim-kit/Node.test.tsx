import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Node } from './Node';

describe('<Node>', () => {
  it('renders its label', () => {
    render(<Node label="Master" state="idle" />);
    expect(screen.getByText('Master')).toBeInTheDocument();
  });

  it('exposes the current state via data attribute (for testing/state-driven styling)', () => {
    const { rerender } = render(<Node label="R1" state="idle" />);
    expect(screen.getByTestId('sim-node')).toHaveAttribute('data-state', 'idle');
    rerender(<Node label="R1" state="active" />);
    expect(screen.getByTestId('sim-node')).toHaveAttribute('data-state', 'active');
    rerender(<Node label="R1" state="failing" />);
    expect(screen.getByTestId('sim-node')).toHaveAttribute('data-state', 'failing');
  });

  it('renders an aria-label including state for screen readers', () => {
    render(<Node label="Master" state="failing" />);
    expect(screen.getByLabelText(/master.*failing/i)).toBeInTheDocument();
  });
});
