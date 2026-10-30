import { createFileRoute } from '@tanstack/react-router';
import { GuideArticlePage } from '@/components/pocket/guide-article-page';

export const Route = createFileRoute('/ar/savings-goals')({
  head: () => ({
    meta: [
      { title: 'إزاي تحدد هدف ادخار واقعي | Pocketjr Finance' },
      { name: 'description', content: 'حوّل رغبتك في الادخار لخطة عملية: قدر التكلفة، اختار المدة، احسب المبلغ الشهري وراجع تقدمك.' },
      { property: 'og:title', content: 'إزاي تحدد هدف ادخار واقعي | Pocketjr Finance' },
      { property: 'og:description', content: 'حوّل رغبتك في الادخار لخطة عملية: قدر التكلفة، اختار المدة، احسب المبلغ الشهري وراجع تقدمك.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'إزاي تحدد هدف ادخار واقعي | Pocketjr Finance' },
      { name: 'twitter:description', content: 'حوّل رغبتك في الادخار لخطة عملية: قدر التكلفة، اختار المدة، احسب المبلغ الشهري وراجع تقدمك.' },
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
