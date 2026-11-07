import { createFileRoute } from '@tanstack/react-router';
import { GuideArticlePage } from '@/components/pocket/guide-article-page';
import { articleSchema } from '@/lib/public-seo';

export const Route = createFileRoute('/monthly-budget')({
  head: () => ({
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(articleSchema('en', '/monthly-budget', "Monthly Budget: Make Your Salary Last | Pocketjr Finance", "Build a monthly budget, list bills due before payday and calculate a realistic daily spending limit using your own numbers.")) }],
    meta: [
      { title: 'Monthly Budget: Make Your Salary Last | Pocketjr Finance' },
      { name: 'description', content: 'Build a monthly budget, list bills due before payday and calculate a realistic daily spending limit using your own numbers.' },
      { property: 'og:title', content: 'Monthly Budget: Make Your Salary Last | Pocketjr Finance' },
      { property: 'og:description', content: 'Build a monthly budget, list bills due before payday and calculate a realistic daily spending limit using your own numbers.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Monthly Budget: Make Your Salary Last | Pocketjr Finance' },
      { name: 'twitter:description', content: 'Build a monthly budget, list bills due before payday and calculate a realistic daily spending limit using your own numbers.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/monthly-budget' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/monthly-budget' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/monthly-budget' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/monthly-budget' },
    ],
  }),
  component: MonthlyBudgetRoute,
});

function MonthlyBudgetRoute() {
  return <GuideArticlePage slug="monthly-budget" />;
}
