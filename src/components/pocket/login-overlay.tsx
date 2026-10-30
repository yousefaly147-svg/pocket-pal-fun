import { useEffect } from 'react';
import { LogoMark, WalletFriend } from '@/components/cartoon';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';

/** Shortest time the login transition stays visible, so fast logins still feel intentional. */
export const LOGIN_OVERLAY_MIN_MS = 750;
/** Fallback for a stalled dashboard bootstrap, measured after authentication succeeds. */
export const LOGIN_OVERLAY_LOADING_MAX_MS = 150_000;

/** Called by the Dashboard: settles a login transition once data and preferences are both ready. */
export function useSettleLoginTransition(prefsReady: boolean, dataReady: boolean) {
  const { settleLoginTransition } = useAuth();

  useEffect(() => {
    if (prefsReady && dataReady) settleLoginTransition();
  }, [prefsReady, dataReady, settleLoginTransition]);
}

export function LoginOverlay() {
  const { t } = useI18n();
  const { loginTransition, endLoginTransition } = useAuth();

  useEffect(() => {
    if (!loginTransition || loginTransition.phase === 'authenticating') return;

    const isSettled = loginTransition.phase === 'settled';
    const elapsed = Date.now() - (isSettled
      ? loginTransition.startedAt
      : loginTransition.phaseStartedAt);
    const limit = isSettled ? LOGIN_OVERLAY_MIN_MS : LOGIN_OVERLAY_LOADING_MAX_MS;
    const wait = Math.max(0, limit - elapsed);
    const id = setTimeout(endLoginTransition, wait);

    return () => clearTimeout(id);
  }, [loginTransition, endLoginTransition]);

  if (!loginTransition) return null;

  const label = t(loginTransition.phase === 'authenticating' ? 'login.signingIn' : 'login.preparing');

  return (
    <div
      className="login-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-testid="login-overlay"
    >
      <WalletFriend />
      <LogoMark />
      <h1>{label}</h1>
      <div className="login-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <p>{t('login.wait')}</p>
    </div>
  );
}
