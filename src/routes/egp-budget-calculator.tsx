import { createFileRoute } from '@tanstack/react-router';
import { EGPBudgetCalculator } from '@/components/pocket/egp-budget-calculator';

export const Route = createFileRoute('/egp-budget-calculator')({
  head: () => ({
    meta: [
      { title: 'Free EGP Monthly Budget Calculator for Egypt | Pocketjr Finance' },
      { name: 'description', content: 'Plan a monthly budget in Egyptian pounds. Calculate planned expenses, savings and the money left from your monthly income with this free calculator.' },
      { property: 'og:title', content: 'Free EGP Monthly Budget Calculator | Pocketjr Finance' },
      { property: 'og:description', content: 'Calculate planned expenses, savings and what remains from your income in Egyptian pounds.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Free EGP Monthly Budget Calculator | Pocketjr Finance' },
      { name: 'twitter:description', content: 'Plan a monthly budget in Egyptian pounds with a free, simple calculator.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/egp-budget-calculator' },
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
