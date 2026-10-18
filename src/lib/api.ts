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

export type ApiErrorCode = 'network' | 'timeout' | 'unauthorized' | 'invalidCredentials' | 'emailTaken' | 'usernameTaken' | 'invalidInput' | 'server' | 'unknown';

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
export type Transaction = { id: string; type: TxType; amount: number; category: string; description: string; createdAt: string; source?: string };
export type Investment = { id: string; kind: InvKind; amount: number; note: string; createdAt: string };
export type MoneyData = { transactions: Transaction[]; investments: Investment[] };
export type SavingsGoal = { name: string; target: number; saved: number };
export type UserPreferences = { budget: number | null; goal: SavingsGoal | null; currency: string | null };
export type PreferencesResult = { preferences: UserPreferences; hasSavedPreferences: boolean };
export type AuthResult = { token: string; user: { id: string; email: string; username: string } };

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
    ...(typeof r['source'] === 'string' ? { source: r['source'] } : {}),
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


const GUEST_DATA_PREFIX = 'pocket:guest:data:v1:';
const EMPTY_MONEY_DATA: MoneyData = { transactions: [], investments: [] };

function guestIdFromToken(token: string): string | null {
  return token.startsWith('guest-local:') ? token.slice('guest-local:'.length) : null;
}
function guestDataKey(token: string): string | null {
  const id = guestIdFromToken(token);
  return id ? `${GUEST_DATA_PREFIX}${id}` : null;
}
function isGuestToken(token: string): boolean { return guestIdFromToken(token) !== null; }
function readGuestData(token: string): MoneyData {
  const key = guestDataKey(token);
  if (!key || typeof window === 'undefined') return EMPTY_MONEY_DATA;
  try { return toMoneyData(JSON.parse(window.localStorage.getItem(key) ?? '{}')); }
  catch { return EMPTY_MONEY_DATA; }
}
function writeGuestData(token: string, data: MoneyData): void {
  const key = guestDataKey(token);
  if (!key || typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify({
    transactions: data.transactions.map(item => ({ ...item, created_at: item.createdAt })),
    investments: data.investments.map(item => ({ ...item, created_at: item.createdAt })),
  }));
}
function localId(): string {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
function localTimestamp(value?: string): string {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}
function addGuestTransaction(token: string, input: { type: TxType; amount: number; category: string; description: string; created_at?: string }): Transaction {
  const data = readGuestData(token);
  const saved: Transaction = {
    id: `guest-tx-${localId()}`, type: input.type, amount: Math.abs(input.amount),
    category: input.category || 'Other', description: input.description || '',
    createdAt: localTimestamp(input.created_at),
  };
  writeGuestData(token, { ...data, transactions: [saved, ...data.transactions] });
  return saved;
}
function addGuestInvestment(token: string, input: { kind: InvKind; amount: number; note: string; created_at?: string }): Investment {
  const data = readGuestData(token);
  const saved: Investment = {
    id: `guest-inv-${localId()}`, kind: input.kind, amount: Math.abs(input.amount),
    note: input.note || '', createdAt: localTimestamp(input.created_at),
  };
  writeGuestData(token, { ...data, investments: [saved, ...data.investments] });
  return saved;
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
      : res.status === 409 ? (message.toLowerCase().includes('username') || path === '/api/profile' ? 'usernameTaken' : 'emailTaken')
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
  const email = String(user['email'] ?? '');
  return { token, user: { id: String(user['id'] ?? ''), email, username: String(user['username'] ?? email.split('@')[0]) } };
}

export const api = {
  login: async (email: string, password: string) => toAuth(await request('/api/auth/login', { method: 'POST', body: { email, password } })),
  register: async (email: string, password: string, username: string) => toAuth(await request('/api/auth/register', { method: 'POST', body: { email, password, username } })),
  updateUsername: async (token: string, username: string) => toAuth(await request('/api/profile', { method: 'PATCH', body: { username }, token })),
  /** Requires a configured Google client ID on the frontend and a verified server endpoint. */
  googleLogin: async (credential: string) => toAuth(await request('/api/auth/google', { method: 'POST', body: { credential } })),
  getData: async (token: string) => isGuestToken(token) ? readGuestData(token) : toMoneyData(await request('/api/data', { token })),
  getPreferences: async (token: string): Promise<PreferencesResult> => {
    if (isGuestToken(token)) {
      return { preferences: { budget: null, goal: null, currency: null }, hasSavedPreferences: false };
    }
    const raw = (await request('/api/preferences', { token })) as Raw;
    const p = (raw['preferences'] && typeof raw['preferences'] === 'object' ? raw['preferences'] : {}) as Raw;
    const budgetValue = p['budget'];
    const budget = budgetValue == null ? null : Number(budgetValue);
    const suppliedGoal = p['goal'];
    const goal = suppliedGoal && typeof suppliedGoal === 'object' && !Array.isArray(suppliedGoal)
      ? {
          name: typeof (suppliedGoal as Raw)['name'] === 'string' ? String((suppliedGoal as Raw)['name']) : '',
          target: Number((suppliedGoal as Raw)['target']),
          saved: Number((suppliedGoal as Raw)['saved'] ?? 0),
        }
      : null;
    const currencies = ['EGP', 'USD', 'SAR', 'EUR', 'AED', 'GBP'];
    const rawCurrency = p['currency'];
    const currency = typeof rawCurrency === 'string' && currencies.includes(rawCurrency) ? rawCurrency : null;
    return {
      preferences: {
        budget: budget !== null && Number.isFinite(budget) && budget > 0 ? budget : null,
        goal: goal && goal.name.trim() && Number.isFinite(goal.target) && goal.target > 0 && Number.isFinite(goal.saved) && goal.saved >= 0 ? goal : null,
        currency,
      },
      hasSavedPreferences: raw['hasSavedPreferences'] === true,
    };
  },
  updatePreferences: async (token: string, patch: Partial<UserPreferences>): Promise<PreferencesResult> => {
    if (isGuestToken(token)) throw new ApiError('invalidInput', 400, 'Guest preferences are saved locally.');
    const raw = (await request('/api/preferences', { method: 'PATCH', body: patch, token })) as Raw;
    const p = (raw['preferences'] && typeof raw['preferences'] === 'object' ? raw['preferences'] : {}) as Raw;
    const budgetValue = p['budget'];
    const budget = budgetValue == null ? null : Number(budgetValue);
    const suppliedGoal = p['goal'];
    const goal = suppliedGoal && typeof suppliedGoal === 'object' && !Array.isArray(suppliedGoal)
      ? {
          name: typeof (suppliedGoal as Raw)['name'] === 'string' ? String((suppliedGoal as Raw)['name']) : '',
          target: Number((suppliedGoal as Raw)['target']),
          saved: Number((suppliedGoal as Raw)['saved'] ?? 0),
        }
      : null;
    const currencies = ['EGP', 'USD', 'SAR', 'EUR', 'AED', 'GBP'];
    const rawCurrency = p['currency'];
    const currency = typeof rawCurrency === 'string' && currencies.includes(rawCurrency) ? rawCurrency : null;
    return {
      preferences: {
        budget: budget !== null && Number.isFinite(budget) && budget > 0 ? budget : null,
        goal: goal && goal.name.trim() && Number.isFinite(goal.target) && goal.target > 0 && Number.isFinite(goal.saved) && goal.saved >= 0 ? goal : null,
        currency,
      },
      hasSavedPreferences: raw['hasSavedPreferences'] === true,
    };
  },
  addTransaction: async (token: string, input: { type: TxType; amount: number; category: string; description: string; created_at?: string }) => {
    if (isGuestToken(token)) return addGuestTransaction(token, input);
    const tx = toTransaction((await request('/api/transactions', { method: 'POST', body: { ...input, createdAt: input.created_at }, token })) as Raw);
    if (!tx) throw new ApiError('unknown', 200, 'Unexpected response');
    return tx;
  },
  deleteTransaction: async (token: string, id: string) => {
    if (isGuestToken(token)) {
      const data = readGuestData(token);
      writeGuestData(token, { ...data, transactions: data.transactions.filter(item => item.id !== id) });
      return;
    }
    await request(`/api/transactions/${encodeURIComponent(id)}`, { method: 'DELETE', token });
  },
  addInvestment: async (token: string, input: { kind: InvKind; amount: number; note: string; created_at?: string }) => {
    if (isGuestToken(token)) return addGuestInvestment(token, input);
    const inv = toInvestment((await request('/api/investments', { method: 'POST', body: { ...input, createdAt: input.created_at }, token })) as Raw);
    if (!inv) throw new ApiError('unknown', 200, 'Unexpected response');
    return inv;
  },
  deleteInvestment: async (token: string, id: string) => {
    if (isGuestToken(token)) {
      const data = readGuestData(token);
      writeGuestData(token, { ...data, investments: data.investments.filter(item => item.id !== id) });
      return;
    }
    await request(`/api/investments/${encodeURIComponent(id)}`, { method: 'DELETE', token });
  },
};

/** Reads the (unverified) JWT payload for display/session expiry only; the API verifies the token. */
export function decodeToken(token: string): { id: string; email: string; username?: string | undefined; exp: number | undefined } | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4)) % 4);
    const payload = JSON.parse(decodeURIComponent(Array.from(atob(b64), c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''))) as Raw;
    const id = payload['id'] ?? payload['sub'];
    if (id == null) return null;
    return { id: String(id), email: String(payload['email'] ?? ''), username: typeof payload['username'] === 'string' ? payload['username'] : undefined, exp: typeof payload['exp'] === 'number' ? payload['exp'] : undefined };
  } catch {
    return null;
  }
}
