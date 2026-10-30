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
      { title: 'Pocketjr – Free Expense Tracker & Budget Planner' },
      { name: 'description', content: 'Track income, expenses, investments, budgets and savings goals with Pocketjr, a free personal finance tracker for web and Android with English and Arabic support. Try it as a guest.' },
      { property: 'og:title', content: 'Pocketjr – Free Expense Tracker & Budget Planner' },
      { property: 'og:description', content: 'Track income, expenses, budgets and savings goals in one simple finance tracker. Start as a guest or create an account to sync supported data.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Pocketjr' },
      { property: 'og:url', content: 'https://pocketjr.lovable.app/' },
      { name: 'twitter:title', content: 'Pocketjr – Free Expense Tracker & Budget Planner' },
      { name: 'twitter:description', content: 'A simple English and Arabic money tracker for income, expenses, budgets and savings goals.' },

      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/' },
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
