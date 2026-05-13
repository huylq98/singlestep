import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Arrow } from './Arrow';

describe('<Arrow>', () => {
  it('renders an SVG path between two points', () => {
    render(<Arrow from={{ x: 0, y: 0 }} to={{ x: 100, y: 0 }} />);
    const svg = screen.getByTestId('sim-arrow');
    expect(svg).toBeInTheDocument();
    expect(svg.querySelector('path')).not.toBeNull();
  });

  it('exposes a data-active attribute when active', () => {
    const { rerender } = render(<Arrow from={{ x: 0, y: 0 }} to={{ x: 100, y: 0 }} />);
    expect(screen.getByTestId('sim-arrow')).toHaveAttribute('data-active', 'false');
    rerender(<Arrow from={{ x: 0, y: 0 }} to={{ x: 100, y: 0 }} active />);
    expect(screen.getByTestId('sim-arrow')).toHaveAttribute('data-active', 'true');
  });
});
