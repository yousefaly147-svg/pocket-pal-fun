import { createFileRoute } from '@tanstack/react-router';
import { LogoMark } from '@/components/cartoon';
import { AuthScreen } from '@/components/pocket/auth-screen';
import { Dashboard } from '@/components/pocket/dashboard';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Pocket — A little happier with your money' },
      { name: 'description', content: 'Your friendly money companion in English and Arabic. Track spending and investments in Egyptian pounds with your My Money account.' },
      { property: 'og:title', content: 'Pocket — Your money, feeling good' },
      { property: 'og:description', content: 'A fresh, friendly way to follow your spending, budget, and investments in EGP.' },
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
