import { useEffect } from 'react';
import { LogoMark, WalletFriend } from '@/components/cartoon';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';

/** Shortest time the login transition stays visible, so fast logins still feel intentional. */
export const LOGIN_OVERLAY_MIN_MS = 750;
/** Safety net: never keep the overlay up longer than this, even if something stalls. */
export const LOGIN_OVERLAY_MAX_MS = 45_000;

export function LoginOverlay() {
  const { t } = useI18n();
  const { loginTransition, endLoginTransition } = useAuth();

  useEffect(() => {
    if (!loginTransition) return;
    const elapsed = Date.now() - loginTransition.startedAt;
    const wait = loginTransition.phase === 'settled'
      ? Math.max(0, LOGIN_OVERLAY_MIN_MS - elapsed)
      : Math.max(0, LOGIN_OVERLAY_MAX_MS - elapsed);
    const id = setTimeout(endLoginTransition, wait);
    return () => clearTimeout(id);
  }, [loginTransition, endLoginTransition]);

  if (!loginTransition) return null;
  const label = t(loginTransition.phase === 'authenticating' ? 'login.signingIn' : 'login.preparing');
  return (
    <div className="login-overlay" role="status" aria-live="polite" aria-busy="true" data-testid="login-overlay">
      <WalletFriend />
      <LogoMark />
      <h1>{label}</h1>
      <div className="login-dots" aria-hidden="true"><i /><i /><i /></div>
      <p>{t('login.wait')}</p>
    </div>
  );
}
