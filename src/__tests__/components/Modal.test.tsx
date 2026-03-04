import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/components/common/Modal';

// Tests 24, 25, 26 — Modal component (we stop at 24 per overall plan)
// Counts as tests 22–24 in component suite

describe('Modal', () => {
  it('renders children content when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Modal Content</p>
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render any content when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <p>Modal Content</p>
      </Modal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('calls onClose when the backdrop is clicked', () => {
    const handleClose = jest.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>
    );
    // The backdrop has class transition-opacity and triggers onClose on click
    const backdrop = container.querySelector('.transition-opacity');
    fireEvent.click(backdrop!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
