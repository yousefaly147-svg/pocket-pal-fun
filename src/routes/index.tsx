import { createFileRoute } from '@tanstack/react-router';
import { AuthScreen } from '@/components/pocket/auth-screen';
import { Dashboard } from '@/components/pocket/dashboard';
import { LandingPage } from '@/components/pocket/landing-page';
import { LoginOverlay } from '@/components/pocket/login-overlay';
import { useAuth } from '@/lib/auth';
import { websiteSchema } from '@/lib/website-schema';

export const Route = createFileRoute('/')({
  head: () => ({
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(websiteSchema('en')) }],
    meta: [
      { title: 'Pocketjr Finance – Free Money Manager & Expense Tracker' },
      { name: 'description', content: 'Pocketjr Finance is a free personal money manager and expense tracker for income, spending, budgets, investments and savings goals. Use it in English or Arabic.' },
      { property: 'og:title', content: 'Pocketjr Finance – Free Money Manager & Expense Tracker' },
      { property: 'og:description', content: 'Pocketjr Finance helps you manage income, expenses, budgets, investments and savings goals with a free personal money manager and expense tracker.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { property: 'og:url', content: 'https://pocketjr.lovable.app/' },
      { name: 'twitter:title', content: 'Pocketjr Finance – Free Money Manager & Expense Tracker' },
      { name: 'twitter:description', content: 'A free English and Arabic personal money manager for tracking income, expenses, budgets and savings goals.' },

      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/' },
    ],
  }),
  component: Index,
});

export function Index() {
  const { status, session, authScreenOpen, closeAuthScreen } = useAuth();
  if (status === 'checking') return (
    <>
      <LandingPage />
    </>
  );
  return <>
    {authScreenOpen ? <AuthScreen onDismiss={closeAuthScreen} />
      : status === 'signedOut' || !session ? <LandingPage />
      : <Dashboard key={session.userId} />}
    <LoginOverlay />
  </>;
}
