import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Legend } from './Legend';

describe('<Legend>', () => {
  it('renders all entries with their labels', () => {
    render(
      <Legend
        items={[
          { color: 'red', label: 'failing' },
          { color: 'green', label: 'healthy' },
        ]}
      />
    );
    expect(screen.getByText('failing')).toBeInTheDocument();
    expect(screen.getByText('healthy')).toBeInTheDocument();
  });
});
