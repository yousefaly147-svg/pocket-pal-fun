import { createFileRoute } from '@tanstack/react-router';
import { AuthScreen } from '@/components/pocket/auth-screen';
import { Dashboard } from '@/components/pocket/dashboard';
import { LandingPage } from '@/components/pocket/landing-page';
import { LoginOverlay } from '@/components/pocket/login-overlay';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Pocketjr Money Tracker | Free Expense Tracker & Budget Planner' },
      { name: 'description', content: 'Track income, expenses, investments, budgets and savings goals with Pocketjr, a free personal finance tracker for web and Android with English and Arabic support. Try it as a guest.' },
      { property: 'og:title', content: 'Pocketjr Money Tracker | Free Expense Tracker & Budget Planner' },
      { property: 'og:description', content: 'Track income, expenses, budgets and savings goals in one simple finance tracker. Start as a guest or create an account to sync supported data.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Pocketjr' },
      { property: 'og:url', content: 'https://pocketjr.lovable.app/' },
      { name: 'twitter:title', content: 'Pocketjr Money Tracker | Free Expense Tracker & Budget Planner' },
      { name: 'twitter:description', content: 'A simple English and Arabic money tracker for income, expenses, budgets and savings goals.' },

      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/' },
    ],
  }),
  component: Index,
});

function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://pocketjr.lovable.app/",
    "name": "Pocketjr Money Tracker",
    "alternateName": ["Pocketjr", "Pocketjr Budget Tracker"],
    "description": "A free personal finance tracker for recording income, expenses, budgets, investments and savings goals.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function Index() {
  const { status, session, authScreenOpen, closeAuthScreen } = useAuth();
  if (status === 'checking') return (
    <>
      <WebsiteStructuredData />
      <LandingPage />
    </>
  );
  return <>
    <WebsiteStructuredData />
    {authScreenOpen ? <AuthScreen onDismiss={closeAuthScreen} />
      : status === 'signedOut' || !session ? <LandingPage />
      : <Dashboard key={session.userId} />}
    <LoginOverlay />
  </>;
}
