import { createFileRoute } from '@tanstack/react-router';
import { GuideArticlePage } from '@/components/pocket/guide-article-page';
import { articleSchema } from '@/lib/public-seo';

export const Route = createFileRoute('/ar/monthly-budget')({
  head: () => ({
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(articleSchema('ar', '/monthly-budget', "ميزانية شهرية في مصر: إزاي تخلي المرتب يكفي | Pocketjr Finance", "اعمل ميزانية شهرية بالجنيه المصري، وسجّل الفواتير اللي لسه هتتدفع قبل القبض، واحسب حد صرف يومي واقعي بأرقامك.")) }],
    meta: [
      { title: 'ميزانية شهرية في مصر: إزاي تخلي المرتب يكفي | Pocketjr Finance' },
      { name: 'description', content: 'اعمل ميزانية شهرية بالجنيه المصري، وسجّل الفواتير اللي لسه هتتدفع قبل القبض، واحسب حد صرف يومي واقعي بأرقامك.' },
      { property: 'og:title', content: 'ميزانية شهرية في مصر: إزاي تخلي المرتب يكفي | Pocketjr Finance' },
      { property: 'og:description', content: 'اعمل ميزانية شهرية بالجنيه المصري، وسجّل الفواتير اللي لسه هتتدفع قبل القبض، واحسب حد صرف يومي واقعي بأرقامك.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'ميزانية شهرية في مصر: إزاي تخلي المرتب يكفي | Pocketjr Finance' },
      { name: 'twitter:description', content: 'اعمل ميزانية شهرية بالجنيه المصري، وسجّل الفواتير اللي لسه هتتدفع قبل القبض، واحسب حد صرف يومي واقعي بأرقامك.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/monthly-budget' },
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
