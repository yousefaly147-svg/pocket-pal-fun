import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  loginWithGoogle: vi.fn(),
  useGoogleConfig: vi.fn(() => false),
  retryGoogleConfig: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  useAuth: () => ({
    login: mocks.login,
    register: mocks.register,
    loginWithGoogle: mocks.loginWithGoogle,
    notice: null,
  }),
}));
vi.mock('@/lib/api', () => ({
  ApiError: class ApiError extends Error {
    code = 'unknown';
    status = 500;
  },
}));
vi.mock('@/lib/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    lang: 'en',
  }),
}));
vi.mock('@/components/pocket/google-signin', () => ({
  GoogleSignIn: () => null,
  retryGoogleConfig: mocks.retryGoogleConfig,
  useGoogleConfig: mocks.useGoogleConfig,
}));
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: Record<string, unknown>) => <button {...props}>{children as never}</button>,
}));
vi.mock('@/components/cartoon', () => ({
  LogoMark: () => <div>Pocketjr</div>,
  WalletFriend: () => <div aria-hidden="true" />,
}));
vi.mock('./lang-toggle', () => ({
  LangToggle: () => <div>Language</div>,
}));

import { AuthScreen } from './auth-screen';

afterEach(() => {
  vi.clearAllMocks();
  mocks.useGoogleConfig.mockReturnValue(false);
});

describe('password visibility on login and registration', () => {
  it('starts hidden, reveals the password, then hides it again', () => {
    render(<AuthScreen />);

    const password = document.querySelector<HTMLInputElement>('input[name="password"]')!;
    const toggle = screen.getByRole('button', { name: 'auth.showPassword' });

    expect(password.type).toBe('password');
    fireEvent.click(toggle);
    expect(password.type).toBe('text');
    expect(screen.getByRole('button', { name: 'auth.hidePassword' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'auth.hidePassword' }));
    expect(password.type).toBe('password');
    expect(screen.getByRole('button', { name: 'auth.showPassword' })).toBeTruthy();
  });

  it('keeps visibility state hidden when switching between login and create account', () => {
    render(<AuthScreen />);

    const password = document.querySelector<HTMLInputElement>('input[name="password"]')!;
    fireEvent.click(screen.getByRole('button', { name: 'auth.showPassword' }));
    expect(password.type).toBe('text');

    fireEvent.click(screen.getByRole('tab', { name: 'auth.register' }));
    expect(password.type).toBe('password');
    expect(document.querySelector('input[name="username"]')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'auth.showPassword' }));
    expect(password.type).toBe('text');
  });
});
