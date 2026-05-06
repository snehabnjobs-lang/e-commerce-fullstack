import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, ThemeToggle, useTheme } from '../context/ThemeContext';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

const ThemeDisplay = () => {
  const { theme } = useTheme();
  return <div data-testid="theme">{theme}</div>;
};

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <div>child content</div>
      </ThemeProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('defaults to light theme when localStorage is empty', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('initialises from localStorage', () => {
    localStorage.setItem('freshroot-theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('sets data-theme attribute on documentElement when dark', () => {
    localStorage.setItem('freshroot-theme', 'dark');
    render(<ThemeProvider><div /></ThemeProvider>);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('removes data-theme attribute when light', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('freshroot-theme', 'light');
    render(<ThemeProvider><div /></ThemeProvider>);
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });
});

describe('useTheme', () => {
  it('throws when used outside ThemeProvider', () => {
    const Bad = () => { useTheme(); return null; };
    expect(() => render(<Bad />)).toThrow('useTheme must be used inside ThemeProvider');
  });
});

describe('ThemeToggle', () => {
  it('renders a toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });

  it('toggles from light to dark on click', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('toggles back from dark to light', () => {
    localStorage.setItem('freshroot-theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeToggle />
        <ThemeDisplay />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});
