import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '@/components/common/Button';

// Tests 19, 20, 21 — Button component

describe('Button', () => {
  it('renders the button with the provided children text', () => {
    render(<Button>Click Me</Button>);
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument();
  });

  it('shows "Loading..." text when isLoading is true', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
