import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ToastProvider, useToast } from '../context/ToastContext';

const ToastTrigger = ({ type = 'success', message = 'Hello' }: { type?: string; message?: string }) => {
  const toast = useToast();
  return (
    <button onClick={() => (toast as any)[type](message)}>
      show toast
    </button>
  );
};

describe('ToastProvider', () => {
  it('renders children', () => {
    render(
      <ToastProvider>
        <div>child</div>
      </ToastProvider>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('renders a success toast when triggered', () => {
    render(
      <ToastProvider>
        <ToastTrigger type="success" message="Saved!" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('show toast'));
    expect(screen.getByText('Saved!')).toBeInTheDocument();
    expect(document.querySelector('.toast-success')).toBeInTheDocument();
  });

  it('renders an error toast', () => {
    render(
      <ToastProvider>
        <ToastTrigger type="error" message="Something broke" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('show toast'));
    expect(screen.getByText('Something broke')).toBeInTheDocument();
    expect(document.querySelector('.toast-error')).toBeInTheDocument();
  });

  it('renders a warning toast', () => {
    render(
      <ToastProvider>
        <ToastTrigger type="warning" message="Watch out" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('show toast'));
    expect(document.querySelector('.toast-warning')).toBeInTheDocument();
  });

  it('renders an info toast', () => {
    render(
      <ToastProvider>
        <ToastTrigger type="info" message="FYI" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('show toast'));
    expect(document.querySelector('.toast-info')).toBeInTheDocument();
  });

  it('dismisses a toast when close button is clicked', () => {
    render(
      <ToastProvider>
        <ToastTrigger type="success" message="Dismiss me" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('show toast'));
    expect(screen.getByText('Dismiss me')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Dismiss');
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });

  it('renders multiple toasts', () => {
    render(
      <ToastProvider>
        <ToastTrigger type="success" message="First" />
        <ToastTrigger type="error" message="Second" />
      </ToastProvider>
    );
    const [first, second] = screen.getAllByText('show toast');
    fireEvent.click(first);
    fireEvent.click(second);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});

describe('useToast', () => {
  it('throws when used outside ToastProvider', () => {
    const Bad = () => { useToast(); return null; };
    expect(() => render(<Bad />)).toThrow('useToast must be used inside ToastProvider');
  });
});
