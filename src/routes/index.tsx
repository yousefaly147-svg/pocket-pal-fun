import { createFileRoute } from '@tanstack/react-router';
import { LogoMark } from '@/components/cartoon';
import { AuthScreen } from '@/components/pocket/auth-screen';
import { Dashboard } from '@/components/pocket/dashboard';
import { LandingPage } from '@/components/pocket/landing-page';
import { LoginOverlay } from '@/components/pocket/login-overlay';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Pocket Pal – Free Expense Tracker & Money Manager' },
      { name: 'description', content: 'Track expenses, income, and investments with Pocket Pal, a friendly personal finance tracker with English and Arabic support. Start in EGP, no account required.' },
      { property: 'og:title', content: 'Pocket Pal – Your Money, Feeling Good' },
      { property: 'og:description', content: 'Track expenses, income, and investments with Pocket Pal. Explore the money tracker as a guest or create an account to save your data.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Index,
});

function Index() {
  const { status, session, authScreenOpen, closeAuthScreen } = useAuth();
  if (status === 'checking') return <div className="state-screen" aria-busy="true"><LogoMark /><div className="state-spinner" aria-hidden="true" /></div>;
  return <>
    {authScreenOpen ? <AuthScreen onDismiss={closeAuthScreen} />
      : status === 'signedOut' || !session ? <LandingPage />
      : <Dashboard key={session.userId} />}
    <LoginOverlay />
  </>;
}
