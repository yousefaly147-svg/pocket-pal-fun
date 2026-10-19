import { act, render, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/i18n', () => ({ useI18n: () => ({ lang: 'en', t: (k: string) => k }) }));

import { fetchGoogleConfig, GoogleSignIn, useGoogleConfig } from './google-signin';

function res(body: unknown, ok = true, type = 'application/json'): Response {
  return { ok, status: ok ? 200 : 500, headers: { get: () => type } as unknown as Headers, json: async () => body } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete (window as unknown as { google?: unknown }).google;
  delete (window as unknown as { PocketPalAndroid?: unknown }).PocketPalAndroid;
  delete (window as unknown as { __pocketJrOnNativeGoogleCredential?: unknown }).__pocketJrOnNativeGoogleCredential;
  delete (window as unknown as { __pocketJrOnNativeGoogleError?: unknown }).__pocketJrOnNativeGoogleError;
  document.querySelectorAll('script[data-gsi]').forEach(s => s.remove());
  window.localStorage.removeItem('pocket:google-config:v1');
});

describe('Google runtime config', () => {
  it('requests the config from the API base', async () => {
    const f = vi.fn().mockResolvedValue(res({ enabled: false }));
    vi.stubGlobal('fetch', f);
    await fetchGoogleConfig();
    expect(String(f.mock.calls[0]?.[0])).toMatch(/\/api\/auth\/google\/config$/);
  });

  it('stays disabled when the server reports enabled: false', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res({ enabled: false })));
    expect(await fetchGoogleConfig()).toEqual({ enabled: false });
  });

  it('stays disabled when enabled but no client ID is returned', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res({ enabled: true })));
    expect(await fetchGoogleConfig()).toEqual({ enabled: false });
  });

  it('stays disabled quietly on network, HTTP, or non-JSON errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect(await fetchGoogleConfig()).toEqual({ enabled: false });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res({}, false)));
    expect(await fetchGoogleConfig()).toEqual({ enabled: false });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res('<html>', true, 'text/html')));
    expect(await fetchGoogleConfig()).toEqual({ enabled: false });
  });

  it('returns the public client ID when enabled', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res({ enabled: true, clientId: 'abc.apps.googleusercontent.com' })));
    expect(await fetchGoogleConfig()).toEqual({ enabled: true, clientId: 'abc.apps.googleusercontent.com' });
  });

  it('keeps the last working client ID visible when a later config request fails', async () => {
    const cached = { enabled: true, clientId: 'cached.apps.googleusercontent.com' };
    window.localStorage.setItem('pocket:google-config:v1', JSON.stringify(cached));
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const { result } = renderHook(() => useGoogleConfig());
    expect(result.current).toEqual(cached);
  });

  it('hook is null while loading, then resolves', async () => {
    let resolve!: (r: Response) => void;
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise<Response>(r => { resolve = r; })));
    const { result } = renderHook(() => useGoogleConfig());
    expect(result.current).toBeNull();
    await act(async () => { resolve(res({ enabled: false })); });
    expect(result.current).toEqual({ enabled: false });
  });
});

describe('GoogleSignIn button', () => {
  it('initializes with the returned client ID and forwards the credential', async () => {
    let callback: ((r: { credential?: string }) => void) | undefined;
    const initialize = vi.fn((o: Record<string, unknown>) => { callback = o['callback'] as typeof callback; });
    const renderButton = vi.fn();
    (window as unknown as { google: unknown }).google = { accounts: { id: { initialize, renderButton } } };
    const onCredential = vi.fn();
    render(<GoogleSignIn clientId="abc.apps.googleusercontent.com" onCredential={onCredential} />);
    await waitFor(() => expect(initialize).toHaveBeenCalled());
    expect(initialize.mock.calls[0]?.[0]).toMatchObject({ client_id: 'abc.apps.googleusercontent.com' });
    expect(renderButton).toHaveBeenCalled();
    callback?.({ credential: 'id-token-123' });
    expect(onCredential).toHaveBeenCalledWith('id-token-123');
  });

  it('uses the native Android bridge instead of loading the unsupported web SDK', async () => {
    const requestGoogleSignIn = vi.fn();
    (window as unknown as { PocketPalAndroid: unknown }).PocketPalAndroid = { requestGoogleSignIn };
    const onCredential = vi.fn();
    const onError = vi.fn();
    const { getByRole } = render(<GoogleSignIn clientId="abc.apps.googleusercontent.com" onCredential={onCredential} onError={onError} />);
    const button = getByRole('button', { name: /continue with google/i });
    expect(document.querySelector('script[data-gsi]')).toBeNull();
    act(() => { button.click(); });
    expect(requestGoogleSignIn).toHaveBeenCalledWith('abc.apps.googleusercontent.com');
    const w = window as unknown as { __pocketJrOnNativeGoogleCredential?: (v: string) => void; __pocketJrOnNativeGoogleError?: (v: string) => void };
    act(() => { w.__pocketJrOnNativeGoogleCredential?.('native-id-token'); });
    expect(onCredential).toHaveBeenCalledWith('native-id-token');
    act(() => { w.__pocketJrOnNativeGoogleError?.('User cancelled'); });
    expect(onError).toHaveBeenCalledWith('User cancelled');
  });

  it('cleans up native bridge callbacks on unmount', () => {
    (window as unknown as { PocketPalAndroid: unknown }).PocketPalAndroid = { requestGoogleSignIn: vi.fn() };
    const { unmount } = render(<GoogleSignIn clientId="abc.apps.googleusercontent.com" onCredential={() => {}} />);
    expect((window as unknown as { __pocketJrOnNativeGoogleCredential?: unknown }).__pocketJrOnNativeGoogleCredential).toBeTypeOf('function');
    unmount();
    expect((window as unknown as { __pocketJrOnNativeGoogleCredential?: unknown }).__pocketJrOnNativeGoogleCredential).toBeUndefined();
  });

  it('removes script listeners on unmount', () => {
    const { unmount } = render(<GoogleSignIn clientId="abc" onCredential={() => {}} />);
    const script = document.querySelector<HTMLScriptElement>('script[data-gsi]');
    expect(script).not.toBeNull();
    const remove = vi.spyOn(script!, 'removeEventListener');
    unmount();
    expect(remove).toHaveBeenCalledWith('load', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('keeps a visible retry action if the Google script fails to load', async () => {
    const { getByRole } = render(<GoogleSignIn clientId="abc" onCredential={() => {}} />);
    act(() => { document.querySelector('script[data-gsi]')!.dispatchEvent(new Event('error')); });
    expect(getByRole('button', { name: /retry google sign-in/i })).toBeTruthy();
  });
});
