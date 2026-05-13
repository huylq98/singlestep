import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stage } from './Stage';

describe('<Stage>', () => {
  it('renders children inside an aria-labeled region', () => {
    render(
      <Stage label="Test stage">
        <div data-testid="content">hello</div>
      </Stage>
    );
    const region = screen.getByRole('region', { name: 'Test stage' });
    expect(region).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('falls back to default aria label when label prop is absent', () => {
    render(<Stage><div /></Stage>);
    expect(screen.getByRole('region', { name: 'Simulation' })).toBeInTheDocument();
  });
});
