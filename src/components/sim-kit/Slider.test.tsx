import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Slider } from './Slider';

describe('<Slider>', () => {
  it('renders with the current value visible', () => {
    render(<Slider value={3} min={1} max={10} onChange={() => {}} label="Partitions" />);
    expect(screen.getByText('Partitions')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onChange with the new numeric value', () => {
    const onChange = vi.fn();
    render(<Slider value={3} min={1} max={10} onChange={onChange} label="Partitions" />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '7' } });
    expect(onChange).toHaveBeenCalledWith(7);
  });
});
