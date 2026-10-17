import { useCallback, useEffect, useRef, useState } from 'react';
import { api, type UserPreferences } from './api';

// Signed-in preferences are stored in the My Money account and shared by its devices.
// Guests keep the same preference fields locally, on this device only.
export type Goal = { name: string; target: number; saved: number };
/** Currency changes the displayed label only; it never converts stored amounts. */
export type DevicePrefs = UserPreferences;
const empty: DevicePrefs = { budget: null, goal: null, currency: null };
export const CURRENCIES = ['EGP', 'USD', 'SAR', 'EUR', 'AED', 'GBP'] as const;
const keyFor = (userId: string) => `pocket:device:${userId}`;

function normalize(raw?: Partial<DevicePrefs> | null): DevicePrefs {
  const budget = typeof raw?.budget === 'number' && Number.isFinite(raw.budget) && raw.budget > 0
    ? raw.budget : null;
  const g = raw?.goal;
  const goal = g && typeof g.name === 'string' && g.name.trim().length > 0 &&
    typeof g.target === 'number' && Number.isFinite(g.target) && g.target > 0
    ? { name: g.name, target: g.target, saved: Math.max(0, Number.isFinite(g.saved) ? g.saved : 0) }
    : null;
  const currency = typeof raw?.currency === 'string' &&
    (CURRENCIES as readonly string[]).includes(raw.currency) ? raw.currency : null;
  return { budget, goal, currency };
}

function read(userId: string): DevicePrefs {
  try {
    return normalize(JSON.parse(localStorage.getItem(keyFor(userId)) ?? 'null') as Partial<DevicePrefs> | null);
  } catch {
    return empty;
  }
}

function write(userId: string, prefs: DevicePrefs): void {
  try { localStorage.setItem(keyFor(userId), JSON.stringify(prefs)); } catch { /* local cache is optional */ }
}

function hasPreferences(prefs: DevicePrefs): boolean {
  return prefs.budget !== null || prefs.goal !== null || prefs.currency !== null;
}

export function useDevicePrefs(userId: string, token: string, guest: boolean) {
  const [prefs, setPrefs] = useState<DevicePrefs>(empty);
  const prefsRef = useRef<DevicePrefs>(empty);
  const [loaded, setLoaded] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const saveQueueRef = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    setLoaded(false);
    setSyncError(false);
    const local = read(userId);
    prefsRef.current = local;
    setPrefs(local);

    const load = async () => {
      let next = local;
      if (guest) {
        if (active) {
          prefsRef.current = next;
          setPrefs(next);
          setLoaded(true);
        }
        return;
      }

      try {
        const remote = await api.getPreferences(token);
        next = normalize(remote.preferences);
        // Migrate existing local-only preferences once if the account has none yet.
        if (!remote.hasSavedPreferences && hasPreferences(local)) {
          try {
            const migrated = await api.updatePreferences(token, local);
            next = normalize(migrated.preferences);
          } catch {
            next = local;
            if (active) setSyncError(true);
          }
        }
      } catch {
        // Keep a local fallback visible, but do not claim it has synced.
        next = local;
        if (active) setSyncError(true);
      }

      if (active) {
        prefsRef.current = next;
        setPrefs(next);
        write(userId, next);
        setLoaded(true);
      }
    };
    void load();

    return () => { active = false; };
  }, [userId, token, guest]);

  const update = useCallback(async (patch: Partial<DevicePrefs>): Promise<boolean> => {
    const next = normalize({ ...prefsRef.current, ...patch });
    prefsRef.current = next;
    setPrefs(next);
    write(userId, next);

    if (guest) {
      setSyncError(false);
      return true;
    }

    setSyncError(false);
    // Serialize writes and send the full latest snapshot so a failed earlier save
    // cannot leave another changed field stranded only in the local cache.
    const operation = saveQueueRef.current
      .catch(() => undefined)
      .then(() => api.updatePreferences(token, next));
    saveQueueRef.current = operation;

    try {
      await operation;
      setSyncError(false);
      return true;
    } catch {
      setSyncError(true);
      return false;
    }
  }, [userId, token, guest]);

  // Keep the selected currency while clearing the budget and savings goal.
  const clear = useCallback(() => update({ budget: null, goal: null }), [update]);

  return { prefs, loaded, syncError, update, clear };
}
