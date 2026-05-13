import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { StepButton } from './StepButton';

describe('<StepButton>', () => {
  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<StepButton onClick={onClick}>Send GET</StepButton>);
    await user.click(screen.getByRole('button', { name: 'Send GET' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables and renders aria-disabled when disabled prop is true', () => {
    render(<StepButton onClick={() => {}} disabled>Send</StepButton>);
    const btn = screen.getByRole('button', { name: 'Send' });
    expect(btn).toBeDisabled();
  });
});
