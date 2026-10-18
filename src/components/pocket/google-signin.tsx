import { useEffect, useRef, useState } from 'react';
import { getApiBase } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

// Google sign-in is configured at runtime by the My Money server:
// GET /api/auth/google/config -> { enabled: false } | { enabled: true, clientId }.
// The client ID is public; no secret ever reaches the browser. The ID token
// returned by Google is verified server-side via POST /api/auth/google.

export type GoogleConfig = { enabled: false } | { enabled: true; clientId: string };

export async function fetchGoogleConfig(signal?: AbortSignal): Promise<GoogleConfig> {
  try {
    const res = await fetch(`${getApiBase()}/api/auth/google/config`, signal ? { signal } : {});
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('json')) return { enabled: false };
    const body = (await res.json()) as Record<string, unknown>;
    const clientId = body['clientId'];
    if (body['enabled'] === true && typeof clientId === 'string' && clientId.trim()) return { enabled: true, clientId: clientId.trim() };
  } catch { /* quiet: Google stays hidden */ }
  return { enabled: false };
}

/** null while loading; disabled on any error. */
export function useGoogleConfig(): GoogleConfig | null {
  const [config, setConfig] = useState<GoogleConfig | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    fetchGoogleConfig(controller.signal).then(c => { if (active) setConfig(c); });
    return () => { active = false; controller.abort(); };
  }, []);
  return config;
}

type GoogleId = { accounts: { id: { initialize: (o: Record<string, unknown>) => void; renderButton: (el: HTMLElement, o: Record<string, unknown>) => void } } };
const getGoogle = () => (window as unknown as { google?: GoogleId }).google;

export function GoogleSignIn({ clientId, onCredential }: { clientId: string; onCredential: (credential: string) => void }) {
  const { lang } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onCredential);
  cb.current = onCredential;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!clientId || !ref.current) return;
    let cancelled = false;
    const render = () => {
      const g = getGoogle();
      if (cancelled || !ref.current) return;
      if (!g) { setFailed(true); return; }
      try {
        g.accounts.id.initialize({ client_id: clientId, callback: (r: { credential?: string }) => { if (!cancelled && r.credential) cb.current(r.credential); } });
        ref.current.innerHTML = '';
        g.accounts.id.renderButton(ref.current, { theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', locale: lang, width: 280 });
      } catch { setFailed(true); }
    };
    const onError = () => { if (!cancelled) setFailed(true); };
    let script = document.querySelector<HTMLScriptElement>('script[data-gsi]');
    if (getGoogle()) { render(); return () => { cancelled = true; }; }
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.dataset['gsi'] = '1';
      document.head.appendChild(script);
    }
    const s = script;
    s.addEventListener('load', render);
    s.addEventListener('error', onError);
    return () => {
      cancelled = true;
      s.removeEventListener('load', render);
      s.removeEventListener('error', onError);
    };
  }, [clientId, lang]);

  if (failed) return null;
  return <div className="google-signin" ref={ref} data-testid="google-signin" />;
}
