import { createFileRoute } from '@tanstack/react-router';
import { DailyBudgetCalculator } from '@/components/pocket/daily-budget-calculator';
import { publicHead, toolSchema } from '@/lib/public-seo';
import { dailyFaqs } from '@/lib/tool-content';

const title = 'حاسبة حد الصرف اليومي بالجنيه | Pocketjr Finance';
const description = 'اعرف تقدر تصرف كام في اليوم لحد القبض الجاي بعد الفواتير والادخار. حاسبة مجانية بالجنيه المصري.';

export const Route = createFileRoute('/ar/daily-budget-calculator')({
  head: () => publicHead({ lang: 'ar', enPath: '/daily-budget-calculator', title, description, schema: toolSchema('ar', '/daily-budget-calculator', title, description, dailyFaqs['ar']) }),
  component: DailyBudgetCalculator,
});
