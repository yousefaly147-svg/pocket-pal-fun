import { useState, type FormEvent } from 'react';
import { LogIn, ShieldCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoMark, WalletFriend } from '@/components/cartoon';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useI18n, type TKey } from '@/lib/i18n';
import { LangToggle } from './lang-toggle';
import { GoogleSignIn, googleReady } from './google-signin';

export function AuthScreen() {
  const { t } = useI18n();
  const { login, register, loginWithGoogle, notice } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string>(notice ? t('err.sessionExpired') : '');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '').trim();
    const password = String(fd.get('password') ?? '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError(t('err.email'));
    if (mode === 'register' && password.length < 8) return setError(t('err.password'));
    if (!password) return setError(t('err.password'));
    setBusy(true); setError('');
    try {
      await (mode === 'login' ? login(email, password) : register(email, password));
    } catch (err) {
      const code = err instanceof ApiError ? err.code : 'unknown';
      setError(t(code === 'invalidInput' && mode === 'register' ? 'err.registerInvalid' : (`err.${code}` as TKey)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-top"><div className="brand"><LogoMark /><span className="brand-word">pocket<span className="brand-dot">.</span></span></div><LangToggle /></div>
      <main className="auth-card panel">
        <div className="auth-art balance-card"><WalletFriend /><h1>{t('auth.welcome')}</h1><p>{t('auth.sub')}</p></div>
        <div className="auth-form">
          <div className="auth-tabs" role="tablist" aria-label={t('auth.tabsAria')}>
            <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>{t('auth.login')}</button>
            <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>{t('auth.register')}</button>
          </div>
          <form onSubmit={onSubmit} noValidate>
            <div className="form-grid">
              <label className="field full">{t('auth.email')}<input name="email" type="email" autoComplete="email" required dir="ltr" maxLength={120} /></label>
              <label className="field full">{t('auth.password')}<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={mode === 'register' ? 8 : undefined} maxLength={200} dir="ltr" />{mode === 'register' && <small className="field-hint">{t('auth.passwordHint')}</small>}</label>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <Button type="submit" className="form-submit" disabled={busy}>{mode === 'login' ? <LogIn /> : <UserPlus />}{busy ? t('auth.working') : t(mode === 'login' ? 'auth.submitLogin' : 'auth.submitRegister')}</Button>
          </form>
          {googleReady && <><div className="auth-or"><span>{t('auth.or')}</span></div>
            <GoogleSignIn onCredential={c => { setBusy(true); setError(''); loginWithGoogle(c).catch(() => setError(t('err.google'))).finally(() => setBusy(false)); }} /></>}
          <p className="auth-secure"><ShieldCheck /> {t('auth.secure')}</p>
        </div>
      </main>
    </div>
  );
}
