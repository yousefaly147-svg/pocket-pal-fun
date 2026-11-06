import { createFileRoute } from '@tanstack/react-router';
import { EGPBudgetCalculator } from '@/components/pocket/egp-budget-calculator';
import { publicHead, toolSchema } from '@/lib/public-seo';
import { egpBudgetFaqs } from '@/lib/tool-content';

const title = 'Free EGP Monthly Budget Calculator for Egypt | Pocketjr Finance';
const description = 'Plan a monthly budget in Egyptian pounds. Enter income, fixed and flexible expenses, and planned savings to see what remains. Free calculator; your entries stay in your browser.';

export const Route = createFileRoute('/egp-budget-calculator')({
  head: () => publicHead({
    lang: 'en',
    enPath: '/egp-budget-calculator',
    title,
    description,
    schema: toolSchema('en', '/egp-budget-calculator', title, description, egpBudgetFaqs.en),
  }),
  component: EGPBudgetCalculatorRoute,
});

function EGPBudgetCalculatorRoute() {
  return <EGPBudgetCalculator />;
}
