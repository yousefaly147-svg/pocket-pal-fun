import { useEffect, useRef, useState } from 'react';
import { getApiBase } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

// Google sign-in is configured at runtime by the My Money server:
// GET /api/auth/google/config -> { enabled: false } | { enabled: true, clientId }.
// The client ID is public; no secret ever reaches the browser. The ID token
// returned by Google is verified server-side via POST /api/auth/google.

export type GoogleConfig = { enabled: false } | { enabled: true; clientId: string };

const GOOGLE_CONFIG_RETRY_EVENT = 'pocket:google-config-retry';
export function retryGoogleConfig(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(GOOGLE_CONFIG_RETRY_EVENT));
}

const GOOGLE_CONFIG_CACHE_KEY = 'pocket:google-config:v1';

function readCachedGoogleConfig(): GoogleConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = JSON.parse(window.localStorage.getItem(GOOGLE_CONFIG_CACHE_KEY) ?? 'null') as Record<string, unknown> | null;
    const clientId = value?.['clientId'];
    return value?.['enabled'] === true && typeof clientId === 'string' && clientId.trim()
      ? { enabled: true, clientId: clientId.trim() }
      : null;
  } catch {
    return null;
  }
}

function writeGoogleConfigCache(config: GoogleConfig): void {
  if (typeof window === 'undefined') return;
  try {
    if (config.enabled) window.localStorage.setItem(GOOGLE_CONFIG_CACHE_KEY, JSON.stringify(config));
    else window.localStorage.removeItem(GOOGLE_CONFIG_CACHE_KEY);
  } catch { /* optional cache; Google sign-in must not depend on storage */ }
}

// null means a transient/unusable response; it must not erase the last known working config.
async function requestGoogleConfig(signal?: AbortSignal): Promise<GoogleConfig | null> {
  try {
    const res = await fetch(`${getApiBase()}/api/auth/google/config`, signal ? { signal } : {});
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('json')) return null;
    const body = (await res.json()) as Record<string, unknown>;
    if (body['enabled'] === false) return { enabled: false };
    const clientId = body['clientId'];
    if (body['enabled'] === true && typeof clientId === 'string' && clientId.trim()) {
      return { enabled: true, clientId: clientId.trim() };
    }
  } catch { /* retry below; do not make a temporary outage hide a working setup */ }
  return null;
}

export async function fetchGoogleConfig(signal?: AbortSignal): Promise<GoogleConfig> {
  return (await requestGoogleConfig(signal)) ?? { enabled: false };
}

/** Uses the last working public client ID and retries transient API failures. */
export function useGoogleConfig(): GoogleConfig | null {
  const [config, setConfig] = useState<GoogleConfig | null>(() => readCachedGoogleConfig());
  useEffect(() => {
    let active = true;
    let attempt = 0;
    let controller: AbortController | null = null;
    let retryTimer: number | undefined;
    const delays = [1000, 2500, 5000, 8000, 10000, 10000, 10000, 10000];

    const load = async () => {
      if (!active) return;
      controller?.abort();
      controller = new AbortController();
      const next = await requestGoogleConfig(controller.signal);
      if (!active) return;
      if (next) {
        setConfig(next);
        writeGoogleConfigCache(next);
        attempt = 0;
        return;
      }
      if (attempt < delays.length) {
        retryTimer = window.setTimeout(load, delays[attempt++]);
      }
    };
    const retryNow = () => {
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      attempt = 0;
      void load();
    };
    void load();
    window.addEventListener('online', retryNow);
    window.addEventListener('focus', retryNow);
    window.addEventListener(GOOGLE_CONFIG_RETRY_EVENT, retryNow);
    return () => {
      active = false;
      controller?.abort();
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      window.removeEventListener('online', retryNow);
      window.removeEventListener('focus', retryNow);
      window.removeEventListener(GOOGLE_CONFIG_RETRY_EVENT, retryNow);
    };
  }, []);
  return config;
}

type GoogleId = { accounts: { id: { initialize: (o: Record<string, unknown>) => void; renderButton: (el: HTMLElement, o: Record<string, unknown>) => void } } };
type NativeGoogleBridge = { requestGoogleSignIn?: (clientId: string) => void };
type PocketWindow = Window & {
  google?: GoogleId;
  PocketPalAndroid?: NativeGoogleBridge;
  __pocketJrOnNativeGoogleCredential?: (credential: string) => void;
  __pocketJrOnNativeGoogleError?: (message: string) => void;
};
const getGoogle = () => (window as unknown as PocketWindow).google;

export function GoogleSignIn({ clientId, onCredential, onError }: { clientId: string; onCredential: (credential: string) => void; onError?: (message: string) => void }) {
  const { lang } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onCredential);
  cb.current = onCredential;
  const [failed, setFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [nativeBusy, setNativeBusy] = useState(false);
  const [nativeMode] = useState(() => typeof window !== 'undefined' && typeof (window as unknown as PocketWindow).PocketPalAndroid?.requestGoogleSignIn === 'function');

  useEffect(() => {
    if (!clientId) return;
    if (nativeMode) {
      const w = window as unknown as PocketWindow;
      let cancelled = false;
      w.__pocketJrOnNativeGoogleCredential = credential => {
        if (cancelled) return;
        setNativeBusy(false);
        if (credential) cb.current(credential);
      };
      w.__pocketJrOnNativeGoogleError = message => {
        if (cancelled) return;
        setNativeBusy(false);
        onError?.(message || 'Google sign-in could not be completed. Please try again.');
      };
      return () => {
        cancelled = true;
        if (w.__pocketJrOnNativeGoogleCredential) delete w.__pocketJrOnNativeGoogleCredential;
        if (w.__pocketJrOnNativeGoogleError) delete w.__pocketJrOnNativeGoogleError;
      };
    }
    if (!ref.current) return;
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
    const onScriptError = () => { if (!cancelled) setFailed(true); };
    let script = document.querySelector<HTMLScriptElement>('script[data-gsi]');
    if (getGoogle()) { render(); return () => { cancelled = true; }; }
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.dataset['gsi'] = '1';
      document.head.appendChild(script);
    }
    const s = script;
    s.addEventListener('load', render);
    s.addEventListener('error', onScriptError);
    return () => {
      cancelled = true;
      s.removeEventListener('load', render);
      s.removeEventListener('error', onScriptError);
    };
  }, [clientId, lang, nativeMode, retryCount]);

  if (failed && !nativeMode) return (
    <div className="google-signin google-signin-retry" data-testid="google-signin-retry">
      <button type="button" className="google-native-button" onClick={() => {
        document.querySelector('script[data-gsi]')?.remove();
        setFailed(false);
        setRetryCount(count => count + 1);
      }}>Retry Google sign-in</button>
    </div>
  );
  if (nativeMode) return (
    <div className="google-signin google-signin-native" data-testid="google-signin-native">
      <button type="button" className="google-native-button" disabled={nativeBusy} onClick={() => {
        setNativeBusy(true);
        try { (window as unknown as PocketWindow).PocketPalAndroid?.requestGoogleSignIn?.(clientId); }
        catch { setNativeBusy(false); onError?.('Google sign-in could not be started. Please try again.'); }
      }}>
        <span className="google-g-mark" aria-hidden="true">G</span>
        <span>{nativeBusy ? 'Waiting for Google…' : 'Continue with Google'}</span>
      </button>
    </div>
  );
  return <div className="google-signin" ref={ref} data-testid="google-signin" />;
}
