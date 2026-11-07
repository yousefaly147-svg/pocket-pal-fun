import { createFileRoute } from '@tanstack/react-router';
import { DailyBudgetCalculator } from '@/components/pocket/daily-budget-calculator';
import { publicHead, toolSchema } from '@/lib/public-seo';
import { dailyFaqs } from '@/lib/tool-content';

const title = 'حاسبة حد الصرف اليومي حتى موعد القبض | Pocketjr Finance';
const description = 'احسب حد الصرف اليومي حتى موعد القبض بعد خصم الفواتير والادخار. استخدم أي عملة بشرط إدخال كل المبالغ بنفس العملة.';

export const Route = createFileRoute('/ar/daily-budget-calculator')({
  head: () => publicHead({ lang: 'ar', enPath: '/daily-budget-calculator', title, description, schema: toolSchema('ar', '/daily-budget-calculator', title, description, dailyFaqs['ar']) }),
  component: DailyBudgetCalculator,
});
