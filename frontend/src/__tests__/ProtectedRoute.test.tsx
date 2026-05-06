import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import * as authIndex from '../auth/index';

vi.mock('../auth/index', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../auth/index')>();
  return { ...actual, isAuthenticated: vi.fn() };
});

const renderWithRoutes = (initialPath = '/protected') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/signin" element={<div>Sign In Page</div>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ProtectedRoute', () => {
  it('redirects to /signin when not authenticated', () => {
    vi.mocked(authIndex.isAuthenticated).mockReturnValue(false);
    renderWithRoutes();
    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders the outlet when authenticated', () => {
    vi.mocked(authIndex.isAuthenticated).mockReturnValue({
      token: 'abc',
      user: { _id: 'u1', name: 'Alice', email: 'alice@test.com', role: 0 },
    });
    renderWithRoutes();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
