import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Toggle } from './Toggle';

describe('<Toggle>', () => {
  const options = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' },
  ];

  it('renders all options and marks the selected one', () => {
    render(<Toggle value="b" options={options} onChange={() => {}} ariaLabel="t" />);
    const btnA = screen.getByRole('radio', { name: 'A' });
    const btnB = screen.getByRole('radio', { name: 'B' });
    expect(btnA).toHaveAttribute('aria-checked', 'false');
    expect(btnB).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when an option is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Toggle value="a" options={options} onChange={onChange} ariaLabel="t" />);
    await user.click(screen.getByRole('radio', { name: 'C' }));
    expect(onChange).toHaveBeenCalledWith('c');
  });
});
