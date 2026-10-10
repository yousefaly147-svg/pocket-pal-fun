import { useCallback, useEffect, useState } from 'react';

// Budget and goal are NOT stored by the My Money API. They live in this
// browser only, keyed per account id so accounts on one device never mix.
export type Goal = { name: string; target: number; saved: number };
/** currency is a display symbol/label only; amounts are never converted. */
export type DevicePrefs = { budget: number | null; goal: Goal | null; currency: string | null };
const empty: DevicePrefs = { budget: null, goal: null, currency: null };
export const CURRENCIES = ['EGP', 'USD', 'SAR', 'EUR', 'AED', 'GBP'] as const;
const keyFor = (userId: string) => `pocket:device:${userId}`;

function read(userId: string): DevicePrefs {
  try {
    const raw = JSON.parse(localStorage.getItem(keyFor(userId)) ?? 'null') as Partial<DevicePrefs> | null;
    if (!raw) return empty;
    const budget = typeof raw.budget === 'number' && raw.budget > 0 ? raw.budget : null;
    const g = raw.goal;
    const goal = g && typeof g.name === 'string' && typeof g.target === 'number' && g.target > 0 ? { name: g.name, target: g.target, saved: Math.max(0, Number(g.saved) || 0) } : null;
    const currency = typeof raw.currency === 'string' && (CURRENCIES as readonly string[]).includes(raw.currency) ? raw.currency : null;
    return { budget, goal, currency };
  } catch {
    return empty;
  }
}

export function useDevicePrefs(userId: string) {
  const [prefs, setPrefs] = useState<DevicePrefs>(empty);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setPrefs(read(userId)); setLoaded(true); }, [userId]);
  const update = useCallback((patch: Partial<DevicePrefs>) => {
    setPrefs(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(keyFor(userId), JSON.stringify(next)); } catch { /* storage unavailable */ }
      return next;
    });
  }, [userId]);
  // Clearing device data keeps the currency choice so the first-login prompt isn't shown again.
  const clear = useCallback(() => {
    setPrefs(prev => {
      const next = { ...empty, currency: prev.currency };
      try { localStorage.setItem(keyFor(userId), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [userId]);
  return { prefs, loaded, update, clear };
}
