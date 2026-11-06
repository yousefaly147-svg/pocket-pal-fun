import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentType } from 'react';

const mocks = vi.hoisted(() => ({
  deleteAccount: vi.fn(),
  auth: {
    status: 'signedIn' as string,
    session: {
      token: 'test-session-token',
      userId: 'test-user-123',
      email: 'qa-pocketjr@example.com',
      username: 'qa-pocketjr',
      guest: false,
    } as { token: string; userId: string; email: string; username: string; guest: boolean } | null,
    logout: vi.fn(),
  },
}));

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({ options }),
  Link: ({ children }: { children: unknown }) => children,
}));
vi.mock('@/components/cartoon', () => ({ LogoMark: () => <div>Pocketjr</div> }));
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: Record<string, unknown>) => <button {...props}>{children as never}</button>,
}));
vi.mock('@/lib/api', () => ({ api: { deleteAccount: mocks.deleteAccount } }));
vi.mock('@/lib/auth', () => ({ useAuth: () => mocks.auth }));
vi.mock('@/lib/i18n', () => ({
  useI18n: () => ({ dir: 'ltr', t: (key: string) => key }),
}));

import { Route } from './delete-account';

const DeleteAccountComponent = (Route as unknown as {
  options: { component: ComponentType };
}).options.component;

describe('external account deletion page', () => {
  beforeEach(() => {
    mocks.deleteAccount.mockReset().mockResolvedValue(undefined);
    mocks.auth.logout.mockReset();
    mocks.auth.status = 'signedIn';
    mocks.auth.session = {
      token: 'test-session-token',
      userId: 'test-user-123',
      email: 'qa-pocketjr@example.com',
      username: 'qa-pocketjr',
      guest: false,
    };
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('asks for confirmation, deletes only the signed-in session, clears cached preferences, then logs out', async () => {
    window.localStorage.setItem('pocket:device:test-user-123', JSON.stringify({ budget: 100 }));
    render(<DeleteAccountComponent />);

    fireEvent.click(screen.getByRole('button', { name: 'deletePage.deleteButton' }));

    await waitFor(() => expect(mocks.deleteAccount).toHaveBeenCalledWith('test-session-token'));
    expect(window.confirm).toHaveBeenCalledWith('deletePage.confirmPrompt');
    expect(mocks.auth.logout).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem('pocket:device:test-user-123')).toBeNull();
    expect(await screen.findByText('deletePage.successTitle')).toBeTruthy();
  });

  it('does not call the delete endpoint if confirmation is cancelled', async () => {
    vi.mocked(window.confirm).mockReturnValue(false);
    render(<DeleteAccountComponent />);

    fireEvent.click(screen.getByRole('button', { name: 'deletePage.deleteButton' }));

    expect(window.confirm).toHaveBeenCalledWith('deletePage.confirmPrompt');
    expect(mocks.deleteAccount).not.toHaveBeenCalled();
    expect(mocks.auth.logout).not.toHaveBeenCalled();
  });

  it('does not claim success and shows an error when the endpoint fails', async () => {
    mocks.deleteAccount.mockRejectedValue(new Error('server error'));
    render(<DeleteAccountComponent />);

    fireEvent.click(screen.getByRole('button', { name: 'deletePage.deleteButton' }));

    expect(await screen.findByText('deletePage.error')).toBeTruthy();
    expect(screen.queryByText('deletePage.successTitle')).toBeNull();
  });
});
