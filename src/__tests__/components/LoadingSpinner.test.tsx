import React from 'react';
import { render } from '@testing-library/react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Tests 22, 23 — LoadingSpinner component

describe('LoadingSpinner', () => {
  it('renders an SVG with the default medium size classes', () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-8', 'h-8');
  });

  it('applies large size classes when size prop is "lg"', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-12', 'h-12');
  });
});
