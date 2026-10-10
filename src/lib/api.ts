// Client for the external My Money Express API (hosted on Render).
// Only confirmed routes are used: auth register/login, GET /api/data,
// POST/DELETE /api/transactions and POST/DELETE /api/investments.

export const DEFAULT_API_URL = 'https://my-money-v6c7.onrender.com';

declare global {
  interface Window { MY_MONEY_API_URL?: string }
}

export function getApiBase(): string {
  const fromWindow = typeof window !== 'undefined' ? window.MY_MONEY_API_URL : undefined;
  const fromEnv = import.meta.env['VITE_MY_MONEY_API_URL'] as string | undefined;
  return (fromWindow || fromEnv || DEFAULT_API_URL).replace(/\/+$/, '');
}

export type ApiErrorCode = 'network' | 'timeout' | 'unauthorized' | 'invalidCredentials' | 'emailTaken' | 'invalidInput' | 'server' | 'unknown';

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;
  constructor(code: ApiErrorCode, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export type TxType = 'income' | 'expense';
export type InvKind = 'added' | 'gain' | 'loss';
export type Transaction = { id: string; type: TxType; amount: number; category: string; description: string; createdAt: string };
export type Investment = { id: string; kind: InvKind; amount: number; note: string; createdAt: string };
export type MoneyData = { transactions: Transaction[]; investments: Investment[] };
export type AuthResult = { token: string; user: { id: string; email: string } };

type Raw = Record<string, unknown>;

export function toTransaction(r: Raw): Transaction | null {
  const amount = Number(r['amount']);
  const type = r['type'];
  if (r['id'] == null || !Number.isFinite(amount) || (type !== 'income' && type !== 'expense')) return null;
  return {
    id: String(r['id']), type, amount: Math.abs(amount),
    category: typeof r['category'] === 'string' && r['category'] ? (r['category'] as string) : 'Other',
    description: typeof r['description'] === 'string' ? (r['description'] as string) : '',
    createdAt: typeof r['created_at'] === 'string' ? (r['created_at'] as string) : new Date().toISOString(),
  };
}

export function toInvestment(r: Raw): Investment | null {
  const amount = Number(r['amount']);
  const kind = r['kind'];
  if (r['id'] == null || !Number.isFinite(amount) || (kind !== 'added' && kind !== 'gain' && kind !== 'loss')) return null;
  return {
    id: String(r['id']), kind, amount: Math.abs(amount),
    note: typeof r['note'] === 'string' ? (r['note'] as string) : '',
    createdAt: typeof r['created_at'] === 'string' ? (r['created_at'] as string) : new Date().toISOString(),
  };
}

export function toMoneyData(r: unknown): MoneyData {
  const obj = (r && typeof r === 'object' ? r : {}) as Raw;
  const txs = Array.isArray(obj['transactions']) ? (obj['transactions'] as Raw[]) : [];
  const invs = Array.isArray(obj['investments']) ? (obj['investments'] as Raw[]) : [];
  const byNewest = <T extends { createdAt: string }>(a: T, b: T) => b.createdAt.localeCompare(a.createdAt);
  return {
    transactions: txs.map(toTransaction).filter((x): x is Transaction => x !== null).sort(byNewest),
    investments: invs.map(toInvestment).filter((x): x is Investment => x !== null).sort(byNewest),
  };
}

const TIMEOUT_MS = 70_000; // Render free instances can take ~a minute to wake up.

async function request(path: string, opts: { method?: string; body?: unknown; token?: string } = {}): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(getApiBase() + path, {
      method: opts.method ?? 'GET',
      headers: {
        ...(opts.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : null,
      signal: controller.signal,
    });
  } catch (e) {
    if (controller.signal.aborted) throw new ApiError('timeout', 0, 'Request timed out');
    throw new ApiError('network', 0, e instanceof Error ? e.message : 'Network error');
  } finally {
    clearTimeout(timer);
  }
  // Unknown routes on the server return its website (HTML, status 200). Never treat that as success.
  if (res.ok && !(res.headers.get('content-type') ?? '').includes('json')) throw new ApiError('server', res.status, 'Route not available (non-JSON response)');
  const json: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = json && typeof json === 'object' && typeof (json as Raw)['error'] === 'string' ? ((json as Raw)['error'] as string) : 'Request failed';
    const isAuthRoute = path.startsWith('/api/auth/');
    const code: ApiErrorCode =
      res.status === 401 ? (isAuthRoute ? 'invalidCredentials' : 'unauthorized')
      : res.status === 403 ? 'unauthorized'
      : res.status === 409 ? 'emailTaken'
      : res.status === 400 || res.status === 422 ? 'invalidInput'
      : res.status >= 500 ? 'server' : 'unknown';
    throw new ApiError(code, res.status, message);
  }
  return json;
}

function toAuth(r: unknown): AuthResult {
  const obj = (r ?? {}) as Raw;
  const token = obj['token'];
  if (typeof token !== 'string' || !token) throw new ApiError('unknown', 200, 'Missing token');
  const user = (obj['user'] ?? {}) as Raw;
  return { token, user: { id: String(user['id'] ?? ''), email: String(user['email'] ?? '') } };
}

export const api = {
  login: async (email: string, password: string) => toAuth(await request('/api/auth/login', { method: 'POST', body: { email, password } })),
  register: async (email: string, password: string) => toAuth(await request('/api/auth/register', { method: 'POST', body: { email, password } })),
  /** Requires a NEW server route (not live yet): verifies the Google ID token server-side and returns { token, user }. */
  googleLogin: async (credential: string) => toAuth(await request('/api/auth/google', { method: 'POST', body: { credential } })),
  getData: async (token: string) => toMoneyData(await request('/api/data', { token })),
  // created_at is sent for when the server learns to accept a chosen date; today it is ignored (verified) and the server sets the time.
  addTransaction: async (token: string, input: { type: TxType; amount: number; category: string; description: string; created_at?: string }) => {
    const tx = toTransaction((await request('/api/transactions', { method: 'POST', body: { ...input, createdAt: input.created_at }, token })) as Raw);
    if (!tx) throw new ApiError('unknown', 200, 'Unexpected response');
    return tx;
  },
  deleteTransaction: async (token: string, id: string) => { await request(`/api/transactions/${encodeURIComponent(id)}`, { method: 'DELETE', token }); },
  addInvestment: async (token: string, input: { kind: InvKind; amount: number; note: string; created_at?: string }) => {
    const inv = toInvestment((await request('/api/investments', { method: 'POST', body: { ...input, createdAt: input.created_at }, token })) as Raw);
    if (!inv) throw new ApiError('unknown', 200, 'Unexpected response');
    return inv;
  },
  deleteInvestment: async (token: string, id: string) => { await request(`/api/investments/${encodeURIComponent(id)}`, { method: 'DELETE', token }); },
};

/** Reads the (unverified) JWT payload for display/session expiry only; the API verifies the token. */
export function decodeToken(token: string): { id: string; email: string; exp: number | undefined } | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4)) % 4);
    const payload = JSON.parse(decodeURIComponent(Array.from(atob(b64), c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''))) as Raw;
    const id = payload['id'] ?? payload['sub'];
    if (id == null) return null;
    return { id: String(id), email: String(payload['email'] ?? ''), exp: typeof payload['exp'] === 'number' ? payload['exp'] : undefined };
  } catch {
    return null;
  }
}
