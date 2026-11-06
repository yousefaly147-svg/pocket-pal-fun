import { createFileRoute } from '@tanstack/react-router';
import { EGPBudgetCalculator } from '@/components/pocket/egp-budget-calculator';

export const Route = createFileRoute('/ar/egp-budget-calculator')({
  head: () => ({
    meta: [
      { title: 'حاسبة الميزانية الشهرية بالجنيه المصري مجانًا | Pocketjr Finance' },
      { name: 'description', content: 'خطط ميزانيتك الشهرية بالجنيه المصري. احسب المصاريف والادخار والمبلغ المتبقي من دخلك باستخدام حاسبة مجانية وبسيطة.' },
      { property: 'og:title', content: 'حاسبة الميزانية الشهرية بالجنيه المصري | Pocketjr Finance' },
      { property: 'og:description', content: 'احسب المصاريف والادخار والمتبقي من الدخل بالجنيه المصري باستخدام حاسبة مجانية.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'حاسبة الميزانية الشهرية بالجنيه المصري | Pocketjr Finance' },
      { name: 'twitter:description', content: 'خطط ميزانيتك الشهرية بالجنيه المصري باستخدام حاسبة مجانية وبسيطة.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/egp-budget-calculator' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/egp-budget-calculator' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/egp-budget-calculator' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/egp-budget-calculator' },
    ],
  }),
  component: EGPBudgetCalculatorRoute,
});

function EGPBudgetCalculatorRoute() {
  return <EGPBudgetCalculator />;
}
