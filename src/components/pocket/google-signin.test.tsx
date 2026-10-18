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
  document.querySelectorAll('script[data-gsi]').forEach(s => s.remove());
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

  it('removes script listeners on unmount', () => {
    const { unmount } = render(<GoogleSignIn clientId="abc" onCredential={() => {}} />);
    const script = document.querySelector<HTMLScriptElement>('script[data-gsi]');
    expect(script).not.toBeNull();
    const remove = vi.spyOn(script!, 'removeEventListener');
    unmount();
    expect(remove).toHaveBeenCalledWith('load', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('hides itself quietly if the Google script fails to load', async () => {
    const { container } = render(<GoogleSignIn clientId="abc" onCredential={() => {}} />);
    act(() => { document.querySelector('script[data-gsi]')!.dispatchEvent(new Event('error')); });
    await waitFor(() => expect(container.querySelector('.google-signin')).toBeNull());
  });
});
