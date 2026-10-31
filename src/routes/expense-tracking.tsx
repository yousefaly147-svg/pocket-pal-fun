import { createFileRoute } from '@tanstack/react-router';
import { GuideArticlePage } from '@/components/pocket/guide-article-page';

export const Route = createFileRoute('/expense-tracking')({
  head: () => ({
    meta: [
      { title: 'How to Track and Categorize Expenses | Pocketjr Finance' },
      { name: 'description', content: 'Learn a simple daily expense tracking method, choose useful spending categories and find recurring costs without complicated spreadsheets.' },
      { property: 'og:title', content: 'How to Track and Categorize Expenses | Pocketjr Finance' },
      { property: 'og:description', content: 'Learn a simple daily expense tracking method, choose useful spending categories and find recurring costs without complicated spreadsheets.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'How to Track and Categorize Expenses | Pocketjr Finance' },
      { name: 'twitter:description', content: 'Learn a simple daily expense tracking method, choose useful spending categories and find recurring costs without complicated spreadsheets.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/expense-tracking' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/expense-tracking' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/expense-tracking' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/expense-tracking' },
    ],
  }),
  component: ExpenseTrackingRoute,
});

function ExpenseTrackingRoute() {
  return <GuideArticlePage slug="expense-tracking" />;
}
