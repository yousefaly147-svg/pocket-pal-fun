import { createFileRoute } from '@tanstack/react-router';
import { DailyBudgetCalculator } from '@/components/pocket/daily-budget-calculator';
import { publicHead, toolSchema } from '@/lib/public-seo';
import { dailyFaqs } from '@/lib/tool-content';

const title = 'Daily Budget Calculator Until Payday | Pocketjr Finance';
const description = 'Calculate a daily spending limit until payday after bills and planned savings. Use any currency; enter every amount in the same currency.';

export const Route = createFileRoute('/daily-budget-calculator')({
  head: () => publicHead({ lang: 'en', enPath: '/daily-budget-calculator', title, description, schema: toolSchema('en', '/daily-budget-calculator', title, description, dailyFaqs['en']) }),
  component: DailyBudgetCalculator,
});
