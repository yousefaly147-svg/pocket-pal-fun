import { createFileRoute } from '@tanstack/react-router';
import { GuideArticlePage } from '@/components/pocket/guide-article-page';

export const Route = createFileRoute('/monthly-budget')({
  head: () => ({
    meta: [
      { title: 'How to Make a Monthly Budget in Egypt | Pocketjr Finance' },
      { name: 'description', content: 'A practical beginner guide to planning monthly income and expenses in Egyptian pounds, setting spending limits and reviewing your budget.' },
      { property: 'og:title', content: 'How to Make a Monthly Budget in Egypt | Pocketjr Finance' },
      { property: 'og:description', content: 'A practical beginner guide to planning monthly income and expenses in Egyptian pounds, setting spending limits and reviewing your budget.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'How to Make a Monthly Budget in Egypt | Pocketjr Finance' },
      { name: 'twitter:description', content: 'A practical beginner guide to planning monthly income and expenses in Egyptian pounds, setting spending limits and reviewing your budget.' },
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
