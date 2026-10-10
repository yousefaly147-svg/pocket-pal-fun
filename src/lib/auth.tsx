import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, decodeToken } from './api';

const TOKEN_KEY = 'pocket_token';
export type Session = { token: string; userId: string; email: string };
type Status = 'checking' | 'signedOut' | 'signedIn';
type AuthCtx = {
  status: Status;
  session: Session | null;
  notice: 'sessionExpired' | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: (reason?: 'sessionExpired') => void;
};
const Ctx = createContext<AuthCtx | null>(null);

function sessionFrom(token: string, fallback?: { id: string; email: string }): Session | null {
  const p = decodeToken(token);
  if (p?.exp && p.exp * 1000 <= Date.now()) return null;
  const userId = p?.id || fallback?.id;
  if (!userId) return null;
  return { token, userId, email: p?.email || fallback?.email || '' };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>('checking');
  const [session, setSession] = useState<Session | null>(null);
  const [notice, setNotice] = useState<'sessionExpired' | null>(null);

  useEffect(() => {
    let token: string | null = null;
    try { token = localStorage.getItem(TOKEN_KEY); } catch { /* ignore */ }
    const s = token ? sessionFrom(token) : null;
    if (token && !s) { try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } setNotice('sessionExpired'); }
    setSession(s);
    setStatus(s ? 'signedIn' : 'signedOut');
  }, []);

  const start = useCallback((token: string, user: { id: string; email: string }) => {
    const s = sessionFrom(token, user);
    if (!s) throw new Error('Invalid session');
    queryClient.clear();
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
    setNotice(null);
    setSession(s);
    setStatus('signedIn');
  }, [queryClient]);

  const login = useCallback(async (email: string, password: string) => { const r = await api.login(email, password); start(r.token, r.user); }, [start]);
  const register = useCallback(async (email: string, password: string) => { const r = await api.register(email, password); start(r.token, r.user); }, [start]);
  const loginWithGoogle = useCallback(async (credential: string) => { const r = await api.googleLogin(credential); start(r.token, r.user); }, [start]);
  const logout = useCallback((reason?: 'sessionExpired') => {
    void queryClient.cancelQueries();
    queryClient.clear();
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
    setSession(null);
    setNotice(reason ?? null);
    setStatus('signedOut');
  }, [queryClient]);

  return <Ctx.Provider value={{ status, session, notice, login, register, loginWithGoogle, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
