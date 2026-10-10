import { createFileRoute } from '@tanstack/react-router';
import { LogoMark } from '@/components/cartoon';
import { AuthScreen } from '@/components/pocket/auth-screen';
import { Dashboard } from '@/components/pocket/dashboard';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Pocket Pal — Your Friendly Money Tracker' },
      { name: 'description', content: 'Pocket Pal is a friendly money tracker for recording income, expenses and investments, with a playful dashboard in English and Arabic.' },
      { property: 'og:title', content: 'Pocket Pal — Your Money, Feeling Good' },
      { property: 'og:description', content: 'Track income, expenses and investments with Pocket Pal, a friendly personal finance dashboard.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Index,
});

function Index() {
  const { status, session } = useAuth();
  if (status === 'checking') return <div className="state-screen" aria-busy="true"><LogoMark /><div className="state-spinner" aria-hidden="true" /></div>;
  if (status === 'signedOut' || !session) return <AuthScreen />;
  return <Dashboard key={session.userId} />;
}
