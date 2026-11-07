import { createFileRoute } from '@tanstack/react-router';
import { GuideArticlePage } from '@/components/pocket/guide-article-page';
import { articleSchema } from '@/lib/public-seo';

export const Route = createFileRoute('/expense-tracking')({
  head: () => ({
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(articleSchema('en', '/expense-tracking', "Expense Tracking: App or Spreadsheet? | Pocketjr Finance", "Learn how to track everyday expenses, choose useful categories, review recurring costs and compare a spreadsheet with a personal finance app.")) }],
    meta: [
      { title: 'Expense Tracking: App or Spreadsheet? | Pocketjr Finance' },
      { name: 'description', content: 'Learn how to track everyday expenses, choose useful categories, review recurring costs and compare a spreadsheet with a personal finance app.' },
      { property: 'og:title', content: 'Expense Tracking: App or Spreadsheet? | Pocketjr Finance' },
      { property: 'og:description', content: 'Learn how to track everyday expenses, choose useful categories, review recurring costs and compare a spreadsheet with a personal finance app.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Expense Tracking: App or Spreadsheet? | Pocketjr Finance' },
      { name: 'twitter:description', content: 'Learn how to track everyday expenses, choose useful categories, review recurring costs and compare a spreadsheet with a personal finance app.' },
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
