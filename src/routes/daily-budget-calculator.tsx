import { createFileRoute } from '@tanstack/react-router';
import { DailyBudgetCalculator } from '@/components/pocket/daily-budget-calculator';
import { publicHead, toolSchema } from '@/lib/public-seo';
import { dailyFaqs } from '@/lib/tool-content';

const title = 'Daily Spending Limit Calculator (EGP) | Pocketjr Finance';
const description = 'Work out how much you can spend per day until payday after bills and savings. Free daily budget calculator in Egyptian pounds.';

export const Route = createFileRoute('/daily-budget-calculator')({
  head: () => publicHead({ lang: 'en', enPath: '/daily-budget-calculator', title, description, schema: toolSchema('en', '/daily-budget-calculator', title, description, dailyFaqs['en']) }),
  component: DailyBudgetCalculator,
});
