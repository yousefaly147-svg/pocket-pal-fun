import { useEffect, useState } from 'react';
import { LogoMark } from '@/components/cartoon';
import { CurrencyPrompt } from './currency-prompt';
import { useAuth } from '@/lib/auth';
import { useDevicePrefs } from '@/lib/device-prefs';

function createGuestId(): string {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function GuestEntry() {
  const { startGuest, openAuthScreen } = useAuth();
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    try {
      let id = localStorage.getItem('pocket_guest_id');
      if (!id) {
        id = createGuestId();
        localStorage.setItem('pocket_guest_id', id);
      }
      setGuestId(id);
    } catch {
      setGuestId(createGuestId());
    }
  }, []);

  const { prefs, loaded, update } = useDevicePrefs(guestId ? `guest-${guestId}` : 'guest-pending');

  useEffect(() => {
    if (guestId && loaded && prefs.currency) startGuest(guestId);
  }, [guestId, loaded, prefs.currency, startGuest]);

  if (!guestId || !loaded) {
    return <div className="state-screen" aria-busy="true"><LogoMark /><div className="state-spinner" aria-hidden="true" /></div>;
  }
  if (prefs.currency) {
    return <div className="state-screen" aria-busy="true"><LogoMark /><div className="state-spinner" aria-hidden="true" /></div>;
  }

  return <CurrencyPrompt
    onAccountClick={openAuthScreen}
    onChoose={currency => {
      // Persist the first choice synchronously before switching routes.
      try {
        localStorage.setItem(`pocket:device:guest-${guestId}`, JSON.stringify({ budget: null, goal: null, currency }));
      } catch { /* useDevicePrefs will handle unavailable storage */ }
      update({ currency });
      startGuest(guestId);
    }}
  />;
}
