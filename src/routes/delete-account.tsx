import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { LogOut, Trash2 } from 'lucide-react';
import { AuthScreen } from '@/components/pocket/auth-screen';
import { LogoMark } from '@/components/cartoon';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/delete-account')({
  head: () => ({
    meta: [
      { title: 'Delete your Pocketjr account' },
      { name: 'description', content: 'Request permanent deletion of your Pocketjr account and associated server-stored data.' },
      { name: 'robots', content: 'noindex,follow' },
    ],
  }),
  component: AccountDeletionPage,
});

function AccountDeletionPage() {
  const { t, dir } = useI18n();
  const { status, session, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [busy, setBusy] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  async function submitDeletion() {
    if (!session || session.guest || busy) return;
    if (!window.confirm(t('deletePage.confirmPrompt'))) return;
    setBusy(true);
    setError('');
    try {
      await api.deleteAccount(session.token);
      try { window.localStorage.removeItem(`pocket:device:${session.userId}`); } catch { /* optional local cache */ }
      setCompleted(true);
      logout();
    } catch {
      setError(t('deletePage.error'));
    } finally {
      setBusy(false);
    }
  }

  const page = (children: React.ReactNode) => (
    <main dir={dir} className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="panel w-full max-w-2xl p-6 md:p-10">
        <header className="mb-8 flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="text-sm text-muted-foreground">Pocketjr</p>
            <h1 className="text-2xl font-extrabold tracking-tight">{t('deletePage.title')}</h1>
          </div>
        </header>
        {children}
        <footer className="mt-8 border-t border-border pt-5">
          <Link to="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">{t('deletePage.home')}</Link>
        </footer>
      </section>
    </main>
  );

  if (completed) {
    return page(
      <div role="status" className="space-y-4">
        <h2 className="text-xl font-bold">{t('deletePage.successTitle')}</h2>
        <p className="leading-7 text-muted-foreground">{t('deletePage.successBody')}</p>
      </div>,
    );
  }

  if (status === 'checking') {
    return page(<p role="status" aria-live="polite">{t('auth.working')}</p>);
  }

  if (!session) {
    return page(
      <div className="space-y-5">
        <p className="leading-7 text-muted-foreground">{t('deletePage.intro')}</p>
        <div className="rounded-xl border border-border p-5">
          <h2 className="text-lg font-bold">{t('deletePage.signInHeading')}</h2>
          <p className="mt-2 leading-7 text-muted-foreground">{t('deletePage.signInBody')}</p>
          {!showAuth
            ? <Button className="mt-4" onClick={() => setShowAuth(true)}>{t('deletePage.signInButton')}</Button>
            : <div className="mt-4 space-y-3">
                <Button variant="outline" onClick={() => setShowAuth(false)}>{t('deletePage.home')}</Button>
                <AuthScreen />
              </div>}
        </div>
      </div>,
    );
  }

  if (session.guest) {
    return page(
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{t('deletePage.guestTitle')}</h2>
        <p className="leading-7 text-muted-foreground">{t('deletePage.guestBody')}</p>
        <Button onClick={() => { logout(); setShowAuth(true); }}><LogOut /> {t('deletePage.signInButton')}</Button>
        {showAuth && <AuthScreen />}
      </div>,
    );
  }

  return page(
    <div className="space-y-5">
      <p className="leading-7 text-muted-foreground">{t('deletePage.intro')}</p>
      <p className="text-sm font-semibold" dir="ltr">{t('deletePage.signedInAs', { email: session.email })}</p>
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="flex items-start gap-3">
          <Trash2 className="mt-1 h-5 w-5 shrink-0 text-destructive" />
          <p className="leading-7">{t('deletePage.warning')}</p>
        </div>
      </div>
      {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
      <Button variant="destructive" disabled={busy} onClick={() => void submitDeletion()}>
        <Trash2 />
        {busy ? t('auth.working') : t('deletePage.deleteButton')}
      </Button>
    </div>,
  );
}
