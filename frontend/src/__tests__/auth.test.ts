import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authenticate, isAuthenticated, signout } from '../auth';
import type { AuthData } from '../types';

const mockAuth: AuthData = {
  token: 'test-token-123',
  user: { _id: 'u1', name: 'Alice', email: 'alice@test.com', role: 0 },
};

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('authenticate', () => {
  it('saves auth data to localStorage', () => {
    let called = false;
    authenticate(mockAuth, () => { called = true; });
    expect(localStorage.getItem('jwt')).toBe(JSON.stringify(mockAuth));
    expect(called).toBe(true);
  });
});

describe('isAuthenticated', () => {
  it('returns false when no jwt in localStorage', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('returns parsed auth data when jwt is present', () => {
    localStorage.setItem('jwt', JSON.stringify(mockAuth));
    const result = isAuthenticated();
    expect(result).toEqual(mockAuth);
    expect((result as AuthData).token).toBe('test-token-123');
  });

  it('returns user with correct role', () => {
    const adminAuth: AuthData = { ...mockAuth, user: { ...mockAuth.user, role: 1 } };
    localStorage.setItem('jwt', JSON.stringify(adminAuth));
    const result = isAuthenticated() as AuthData;
    expect(result.user.role).toBe(1);
  });
});

describe('signout', () => {
  it('removes jwt from localStorage', () => {
    localStorage.setItem('jwt', JSON.stringify(mockAuth));
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    signout(() => {});
    expect(localStorage.getItem('jwt')).toBeNull();
  });

  it('calls the callback immediately', () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    let called = false;
    signout(() => { called = true; });
    expect(called).toBe(true);
  });
});
