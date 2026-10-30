import { createFileRoute } from '@tanstack/react-router';
import { GuideArticlePage } from '@/components/pocket/guide-article-page';

export const Route = createFileRoute('/ar/monthly-budget')({
  head: () => ({
    meta: [
      { title: 'إزاي تعمل ميزانية شهرية في مصر | Pocketjr Finance' },
      { name: 'description', content: 'دليل عملي للمبتدئين لتنظيم الدخل والمصروفات بالجنيه المصري وتحديد حدود للصرف ومراجعة الميزانية كل شهر.' },
      { property: 'og:title', content: 'إزاي تعمل ميزانية شهرية في مصر | Pocketjr Finance' },
      { property: 'og:description', content: 'دليل عملي للمبتدئين لتنظيم الدخل والمصروفات بالجنيه المصري وتحديد حدود للصرف ومراجعة الميزانية كل شهر.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'إزاي تعمل ميزانية شهرية في مصر | Pocketjr Finance' },
      { name: 'twitter:description', content: 'دليل عملي للمبتدئين لتنظيم الدخل والمصروفات بالجنيه المصري وتحديد حدود للصرف ومراجعة الميزانية كل شهر.' },
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
