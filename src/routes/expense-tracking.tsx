import { createFileRoute } from '@tanstack/react-router';
import { GuideArticlePage } from '@/components/pocket/guide-article-page';
import { articleSchema } from '@/lib/public-seo';

export const Route = createFileRoute('/expense-tracking')({
  head: () => ({
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(articleSchema('en', '/expense-tracking', "Expense Tracking in Egypt: App or Spreadsheet? | Pocketjr Finance", "Choose an expense tracker in Egypt that fits your routine. Compare a spreadsheet with an app, and check EGP display, Arabic, privacy and device sync.")) }],
    meta: [
      { title: 'Expense Tracking in Egypt: App or Spreadsheet? | Pocketjr Finance' },
      { name: 'description', content: 'Choose an expense tracker in Egypt that fits your routine. Compare a spreadsheet with an app, and check EGP display, Arabic, privacy and device sync.' },
      { property: 'og:title', content: 'Expense Tracking in Egypt: App or Spreadsheet? | Pocketjr Finance' },
      { property: 'og:description', content: 'Choose an expense tracker in Egypt that fits your routine. Compare a spreadsheet with an app, and check EGP display, Arabic, privacy and device sync.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Expense Tracking in Egypt: App or Spreadsheet? | Pocketjr Finance' },
      { name: 'twitter:description', content: 'Choose an expense tracker in Egypt that fits your routine. Compare a spreadsheet with an app, and check EGP display, Arabic, privacy and device sync.' },
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
