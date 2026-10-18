import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, type UserPreferences } from './api';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name: string) => name.toLowerCase() === 'content-type' ? 'application/json' : null } as Headers,
    json: async () => body,
  } as Response;
}

describe('account preference sync API', () => {
  it('migrates the legacy single-goal preference without losing saved progress', async () => {
    const preferences = {
      budget: 4200,
      goal: { name: 'New tablet', target: 15000, saved: 2500 },
      currency: 'SAR',
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      preferences,
      hasSavedPreferences: true,
    }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await api.getPreferences('account-token');

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/preferences');
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer account-token',
    });
    expect(result).toEqual({
      preferences: {
        budget: 4200,
        goal: [{ id: 'legacy-goal-1', name: 'New tablet', target: 15000, saved: 2500, category: 'other' }],
        currency: 'SAR',
      },
      hasSavedPreferences: true,
    });
  });

  it('saves multiple savings goals as a single account preference snapshot', async () => {
    const preferences: UserPreferences = {
      budget: 4200,
      goal: [
        { id: 'goal-tablet', name: 'New tablet', target: 15000, saved: 2500, category: 'technology' },
        { id: 'goal-trip', name: 'Summer trip', target: 12000, saved: 1000, category: 'travel' },
      ],
      currency: 'USD',
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      preferences,
      hasSavedPreferences: true,
    }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await api.updatePreferences('account-token', preferences);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toContain('/api/preferences');
    expect(init.method).toBe('PATCH');
    expect(init.headers).toMatchObject({ Authorization: 'Bearer account-token' });
    expect(JSON.parse(String(init.body))).toEqual(preferences);
    expect(result.preferences).toEqual(preferences);
    expect(result.hasSavedPreferences).toBe(true);
  });

  it('does not silently accept failed cloud preference writes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ error: 'Database unavailable' }, 500)));
    await expect(api.updatePreferences('account-token', { currency: 'EGP' }))
      .rejects.toMatchObject({ code: 'server', status: 500 });
  });
});

describe('entry creation API payloads', () => {
  it('sends the selected transaction date in the field the server accepts', async () => {
    const createdAt = '2024-03-12';
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      id: 101, type: 'expense', amount: 25, category: 'Food',
      description: 'Lunch', created_at: '2024-03-12T12:00:00.000Z',
    }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await api.addTransaction('test-token', {
      type: 'expense', amount: 25, category: 'Food',
      description: 'Lunch', created_at: createdAt,
    });

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(request.body));
    expect(body.created_at).toBe(createdAt);
    expect(body.createdAt).toBe(createdAt);
    expect(result.createdAt).toBe('2024-03-12T12:00:00.000Z');
  });

  it('sends the selected investment date in the field the server accepts', async () => {
    const createdAt = '2024-02-20';
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      id: 202, kind: 'added', amount: 500, note: 'Savings',
      created_at: '2024-02-20T12:00:00.000Z',
    }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await api.addInvestment('test-token', {
      kind: 'added', amount: 500, note: 'Savings', created_at: createdAt,
    });

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(request.body)).createdAt).toBe(createdAt);
    expect(result.createdAt).toBe('2024-02-20T12:00:00.000Z');
  });

  it('surfaces a server-side rejection instead of pretending an entry saved', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ error: 'Invalid entry date' }, 400));
    vi.stubGlobal('fetch', fetchMock);
    await expect(api.addTransaction('test-token', {
      type: 'expense', amount: 10, category: 'Other',
      description: '', created_at: 'not-a-date',
    })).rejects.toMatchObject({ code: 'invalidInput', status: 400 });
  });
});
