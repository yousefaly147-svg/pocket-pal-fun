import { createFileRoute } from '@tanstack/react-router';
import { GuideArticlePage } from '@/components/pocket/guide-article-page';

export const Route = createFileRoute('/savings-goals')({
  head: () => ({
    meta: [
      { title: 'How to Set a Realistic Savings Goal | Pocketjr Finance' },
      { name: 'description', content: 'Turn a savings wish into a practical plan: estimate the cost, choose a timeline, calculate monthly contributions and review progress.' },
      { property: 'og:title', content: 'How to Set a Realistic Savings Goal | Pocketjr Finance' },
      { property: 'og:description', content: 'Turn a savings wish into a practical plan: estimate the cost, choose a timeline, calculate monthly contributions and review progress.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'How to Set a Realistic Savings Goal | Pocketjr Finance' },
      { name: 'twitter:description', content: 'Turn a savings wish into a practical plan: estimate the cost, choose a timeline, calculate monthly contributions and review progress.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/savings-goals' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/savings-goals' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/savings-goals' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/savings-goals' },
    ],
  }),
  component: SavingsGoalsRoute,
});

function SavingsGoalsRoute() {
  return <GuideArticlePage slug="savings-goals" />;
}
