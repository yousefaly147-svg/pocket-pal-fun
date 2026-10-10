import { useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';

// Google sign-in stays completely hidden until BOTH are true:
//  1. VITE_GOOGLE_CLIENT_ID is set (public OAuth Client ID, not a secret), and
//  2. VITE_GOOGLE_AUTH_READY === 'true', set only once the My Money server has
//     POST /api/auth/google that verifies the ID token server-side.
const clientId = import.meta.env['VITE_GOOGLE_CLIENT_ID'] as string | undefined;
export const googleReady = Boolean(clientId) && import.meta.env['VITE_GOOGLE_AUTH_READY'] === 'true';

type GoogleId = { accounts: { id: { initialize: (o: Record<string, unknown>) => void; renderButton: (el: HTMLElement, o: Record<string, unknown>) => void } } };

export function GoogleSignIn({ onCredential }: { onCredential: (credential: string) => void }) {
  const { lang } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onCredential);
  cb.current = onCredential;

  useEffect(() => {
    if (!googleReady || !ref.current) return;
    let cancelled = false;
    const render = () => {
      const g = (window as unknown as { google?: GoogleId }).google;
      if (cancelled || !g || !ref.current) return;
      g.accounts.id.initialize({ client_id: clientId, callback: (r: { credential?: string }) => { if (r.credential) cb.current(r.credential); } });
      ref.current.innerHTML = '';
      g.accounts.id.renderButton(ref.current, { theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', locale: lang, width: 280 });
    };
    const existing = document.querySelector<HTMLScriptElement>('script[data-gsi]');
    if (existing) { if ((window as unknown as { google?: GoogleId }).google) render(); else existing.addEventListener('load', render); }
    else {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.dataset['gsi'] = '1';
      s.addEventListener('load', render);
      document.head.appendChild(s);
    }
    return () => { cancelled = true; };
  }, [lang]);

  if (!googleReady) return null;
  return <div className="google-signin" ref={ref} />;
}
