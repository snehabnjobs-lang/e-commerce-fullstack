import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../core/Navbar';

vi.mock('../hooks/useAuth', () => ({
  useIsAdmin: vi.fn().mockReturnValue(false),
  useIsRegisteredUser: vi.fn().mockReturnValue(false),
  useIsAuthenticated: vi.fn().mockReturnValue(false),
  useUserData: vi.fn().mockReturnValue(false),
}));

vi.mock('../auth', () => ({
  signout: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../context/ThemeContext', () => ({
  ThemeToggle: () => <button aria-label="toggle theme">Theme</button>,
  useTheme: vi.fn().mockReturnValue({ theme: 'light', toggleTheme: vi.fn() }),
}));

vi.mock('../context/ToastContext', () => ({
  useToast: vi.fn().mockReturnValue({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

import * as useAuthHooks from '../hooks/useAuth';

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useAuthHooks.useIsAdmin).mockReturnValue(false);
  vi.mocked(useAuthHooks.useIsRegisteredUser).mockReturnValue(false);
  vi.mocked(useAuthHooks.useIsAuthenticated).mockReturnValue(false);
  vi.mocked(useAuthHooks.useUserData).mockReturnValue(false);
});

describe('Navbar', () => {
  it('renders the FreshRoot logo', () => {
    renderNavbar();
    expect(screen.getByText(/FreshRoot/)).toBeInTheDocument();
  });

  it('renders Home, All Products, and Cart links', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /all products/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
  });

  it('renders the More dropdown button', () => {
    renderNavbar();
    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();
  });

  it('dropdown is closed by default', () => {
    renderNavbar();
    expect(screen.queryByText('My Account')).not.toBeInTheDocument();
  });

  it('opens dropdown when More button is clicked', () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Order History')).toBeInTheDocument();
  });

  it('shows Sign In and Create Account when not authenticated', () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows Sign Out when authenticated', () => {
    vi.mocked(useAuthHooks.useIsAuthenticated).mockReturnValue(true);
    vi.mocked(useAuthHooks.useUserData).mockReturnValue({
      token: 'tok',
      user: { _id: 'u1', name: 'Alice', email: 'a@b.com', role: 0 },
    });
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });

  it('shows Admin Panel link for admin users', () => {
    vi.mocked(useAuthHooks.useIsAdmin).mockReturnValue(true);
    vi.mocked(useAuthHooks.useIsAuthenticated).mockReturnValue(true);
    vi.mocked(useAuthHooks.useUserData).mockReturnValue({
      token: 'tok',
      user: { _id: 'a1', name: 'Admin', email: 'admin@b.com', role: 1 },
    });
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    expect(screen.getByRole('link', { name: /admin panel/i })).toBeInTheDocument();
  });

  it('does not show Admin Panel link for regular users', () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    expect(screen.queryByRole('link', { name: /admin panel/i })).not.toBeInTheDocument();
  });

  it('renders the theme toggle button', () => {
    renderNavbar();
    expect(screen.getByLabelText('toggle theme')).toBeInTheDocument();
  });

  it('shows My Dashboard link for registered users', () => {
    vi.mocked(useAuthHooks.useIsRegisteredUser).mockReturnValue(true);
    renderNavbar();
    expect(screen.getByRole('link', { name: /my dashboard/i })).toBeInTheDocument();
  });
});
