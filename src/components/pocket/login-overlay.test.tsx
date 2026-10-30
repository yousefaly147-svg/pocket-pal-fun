import { act, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ login: vi.fn(), register: vi.fn(), googleLogin: vi.fn() }));
vi.mock('@/lib/api', () => ({
  api: { login: mocks.login, register: mocks.register, googleLogin: mocks.googleLogin },
  clearCachedMoneyData: vi.fn(),
  decodeToken: () => null,
}));
vi.mock('@/lib/i18n', () => ({ useI18n: () => ({ t: (k: string) => k }) }));
vi.mock('@/components/cartoon', () => ({ LogoMark: () => null, WalletFriend: () => null }));

import { AuthProvider, useAuth } from '@/lib/auth';
import { LOGIN_OVERLAY_MIN_MS, LoginOverlay, useSettleLoginTransition } from './login-overlay';

const user = { id: 'u1', email: 'a@b.co', username: 'ab' };
let auth: ReturnType<typeof useAuth>;
let setReady: (r: { data: boolean; prefs: boolean }) => void;

function FakeDashboard() {
  const [ready, set] = useState({ data: false, prefs: false });
  setReady = set;
  useSettleLoginTransition(ready.prefs, ready.data);
  return null;
}
function Harness() {
  auth = useAuth();
  return <>{auth.status === 'signedIn' && <FakeDashboard />}<LoginOverlay /></>;
}
const overlay = () => screen.queryByTestId('login-overlay');
function deferred<T>() { let resolve!: (v: T) => void, reject!: (e: unknown) => void; const promise = new Promise<T>((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; }

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  render(<QueryClientProvider client={new QueryClient()}><AuthProvider><Harness /></AuthProvider></QueryClientProvider>);
});
afterEach(() => { vi.useRealTimers(); vi.clearAllMocks(); });

describe('login loading overlay', () => {
  it('shows during password login and stays until data and preferences are both ready', async () => {
    const d = deferred<{ token: string; user: typeof user }>();
    mocks.login.mockReturnValue(d.promise);
    let p!: Promise<void>;
    act(() => { p = auth.login('a@b.co', 'secret123'); });
    expect(overlay()?.textContent).toContain('login.signingIn');
    expect(overlay()?.getAttribute('aria-busy')).toBe('true');
    await act(async () => { d.resolve({ token: 't', user }); await p; });
    expect(overlay()?.textContent).toContain('login.preparing');

    act(() => setReady({ data: true, prefs: false }));
    await act(async () => { vi.advanceTimersByTime(5000); });
    expect(overlay()).not.toBeNull();

    act(() => setReady({ data: true, prefs: true }));
    await act(async () => { vi.advanceTimersByTime(0); });
    expect(overlay()).toBeNull();
  });

  it('keeps fast logins visible for the short minimum, then hides with no extra delay', async () => {
    mocks.login.mockResolvedValue({ token: 't', user });
    await act(async () => { await auth.login('a@b.co', 'secret123'); });
    act(() => setReady({ data: true, prefs: true }));
    await act(async () => { vi.advanceTimersByTime(LOGIN_OVERLAY_MIN_MS - 50); });
    expect(overlay()).not.toBeNull();
    await act(async () => { vi.advanceTimersByTime(50); });
    expect(overlay()).toBeNull();
    expect(LOGIN_OVERLAY_MIN_MS).toBeGreaterThanOrEqual(700);
    expect(LOGIN_OVERLAY_MIN_MS).toBeLessThanOrEqual(850);
  });

  it('covers Google sign-in the same way', async () => {
    mocks.googleLogin.mockResolvedValue({ token: 't', user });
    await act(async () => { await auth.loginWithGoogle('google-cred'); });
    expect(mocks.googleLogin).toHaveBeenCalledWith('google-cred');
    expect(overlay()).not.toBeNull();
    act(() => setReady({ data: true, prefs: true }));
    await act(async () => { vi.advanceTimersByTime(LOGIN_OVERLAY_MIN_MS); });
    expect(overlay()).toBeNull();
  });

  it('clears immediately when login or Google auth fails, so the form error can show', async () => {
    mocks.login.mockRejectedValue(new Error('bad'));
    await act(async () => { await expect(auth.login('a@b.co', 'wrong')).rejects.toThrow('bad'); });
    expect(overlay()).toBeNull();
    expect(auth.status).toBe('signedOut');
    mocks.googleLogin.mockRejectedValue(new Error('nope'));
    await act(async () => { await expect(auth.loginWithGoogle('x')).rejects.toThrow('nope'); });
    expect(overlay()).toBeNull();
  });

  it('does not appear for guest entry', () => {
    act(() => auth.startGuest('g1'));
    expect(auth.status).toBe('signedIn');
    expect(overlay()).toBeNull();
  });
});
