import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, clearCachedMoneyData, decodeToken } from './api';

declare global {
  interface Window {
    PocketPalAndroid?: {
      setAuthToken(token: string): void;
      clearPendingTeldaImports(accountId: string): void;
      isNotificationAccessEnabled(): boolean;
      isAutoImportEnabled(): boolean;
      setAutoImportEnabled(enabled: boolean): void;
      getTeldaImportStatus(): string;
      requestNotificationAccess(): void;
      configureDailyReminder(enabled: boolean, hour: number, minute: number, title: string, body: string): void;
      areDailyReminderNotificationsEnabled(): boolean;
    };
    __pocketJrOnDailyReminderResult?: (success: boolean) => void;
  }
}

const TOKEN_KEY = 'pocket_token';
export const GUEST_TOKEN_PREFIX = 'guest-local:';

function syncNativeSession(token: string | null) {
  try {
    window.PocketPalAndroid?.setAuthToken(token && !token.startsWith(GUEST_TOKEN_PREFIX) ? token : '');
  } catch { /* native bridge is available only inside the Android app */ }
}
export type Session = { token: string; userId: string; email: string; username: string; guest: boolean };
type Status = 'checking' | 'signedOut' | 'signedIn';
/** Login-only full-screen transition: shown from auth submit until the first dashboard load settles. */
export type LoginTransition = {
  phase: 'authenticating' | 'loading' | 'settled';
  startedAt: number;
  phaseStartedAt: number;
};
type AuthCtx = {
  status: Status;
  session: Session | null;
  notice: 'sessionExpired' | null;
  authScreenOpen: boolean;
  loginTransition: LoginTransition | null;
  /** Dashboard reports that its first data refresh and preferences load have finished. */
  settleLoginTransition: () => void;
  endLoginTransition: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  changeUsername: (username: string) => Promise<void>;
  startGuest: (guestId: string) => void;
  openAuthScreen: () => void;
  closeAuthScreen: () => void;
  logout: (reason?: 'sessionExpired') => void;
};
const Ctx = createContext<AuthCtx | null>(null);

function sessionFrom(token: string, fallback?: { id: string; email: string; username?: string }): Session | null {
  if (token.startsWith(GUEST_TOKEN_PREFIX)) {
    const guestId = token.slice(GUEST_TOKEN_PREFIX.length);
    if (!guestId) return null;
    return { token, userId: `guest-${guestId}`, email: '', username: '', guest: true };
  }
  const p = decodeToken(token);
  if (p?.exp && p.exp * 1000 <= Date.now()) return null;
  const userId = p?.id || fallback?.id;
  if (!userId) return null;
  const email = p?.email || fallback?.email || '';
  return {
    token, userId, email,
    username: p?.username || fallback?.username || email.split('@')[0] || '',
    guest: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>('checking');
  const [session, setSession] = useState<Session | null>(null);
  const [notice, setNotice] = useState<'sessionExpired' | null>(null);
  const [authScreenOpen, setAuthScreenOpen] = useState(false);
  const [loginTransition, setLoginTransition] = useState<LoginTransition | null>(null);

  const withTransition = useCallback(async (run: () => Promise<void>) => {
    const startedAt = Date.now();
    setLoginTransition({ phase: 'authenticating', startedAt, phaseStartedAt: startedAt });
    try {
      await run();
      const phaseStartedAt = Date.now();
      setLoginTransition(t => (t ? { ...t, phase: 'loading', phaseStartedAt } : t));
    } catch (err) {
      setLoginTransition(null);
      throw err;
    }
  }, []);
  const settleLoginTransition = useCallback(() => {
    setLoginTransition(t => (t && t.phase === 'loading' ? { ...t, phase: 'settled' } : t));
  }, []);
  const endLoginTransition = useCallback(() => setLoginTransition(null), []);

  useEffect(() => {
    let token: string | null = null;
    try { token = localStorage.getItem(TOKEN_KEY); } catch { /* ignore */ }
    const s = token ? sessionFrom(token) : null;
    if (token && !s) { try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } setNotice('sessionExpired'); }
    setSession(s);
    setStatus(s ? 'signedIn' : 'signedOut');
    syncNativeSession(s?.token ?? null);
  }, []);

  const start = useCallback((token: string, user: { id: string; email: string; username?: string }) => {
    const s = sessionFrom(token, user);
    if (!s) throw new Error('Invalid session');
    queryClient.clear();
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
    syncNativeSession(token);
    setNotice(null);
    setSession(s);
    setStatus('signedIn');
    setAuthScreenOpen(false);
  }, [queryClient]);

  const login = useCallback(async (email: string, password: string) => {
    await withTransition(async () => { const r = await api.login(email, password); start(r.token, r.user); });
  }, [start, withTransition]);

  const register = useCallback(async (email: string, password: string, username: string) => {
    await withTransition(async () => { const r = await api.register(email, password, username); start(r.token, r.user); });
  }, [start, withTransition]);

  const loginWithGoogle = useCallback(async (credential: string) => {
    await withTransition(async () => { const r = await api.googleLogin(credential); start(r.token, r.user); });
  }, [start, withTransition]);

  const changeUsername = useCallback(async (username: string) => {
    if (!session || session.guest) throw new Error('Sign in to change your username.');
    const r = await api.updateUsername(session.token, username);
    start(r.token, r.user);
  }, [session, start]);

  const startGuest = useCallback((guestId: string) => {
    const token = `${GUEST_TOKEN_PREFIX}${guestId}`;
    const s = sessionFrom(token);
    if (!s) return;
    queryClient.clear();
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
    syncNativeSession(null);
    setSession(s);
    setStatus('signedIn');
    setAuthScreenOpen(false);
    setNotice(null);
  }, [queryClient]);

  const openAuthScreen = useCallback(() => setAuthScreenOpen(true), []);
  const closeAuthScreen = useCallback(() => setAuthScreenOpen(false), []);

  const logout = useCallback((reason?: 'sessionExpired') => {
    void queryClient.cancelQueries();
    queryClient.clear();
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
    if (session) clearCachedMoneyData(session.userId);
    syncNativeSession(null);
    setSession(null);
    setNotice(reason ?? null);
    setStatus('signedOut');
    setAuthScreenOpen(false);
    setLoginTransition(null);
  }, [queryClient, session]);

  return <Ctx.Provider value={{
    status, session, notice, authScreenOpen, loginTransition, settleLoginTransition, endLoginTransition, login, register, loginWithGoogle,
    changeUsername, startGuest, openAuthScreen, closeAuthScreen, logout,
  }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
