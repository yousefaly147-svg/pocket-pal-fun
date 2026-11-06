import { createFileRoute } from '@tanstack/react-router';
import { EGPBudgetCalculator } from '@/components/pocket/egp-budget-calculator';
import { publicHead, toolSchema } from '@/lib/public-seo';
import { egpBudgetFaqs } from '@/lib/tool-content';

const title = 'حاسبة الميزانية الشهرية بالجنيه المصري مجانًا | Pocketjr Finance';
const description = 'خطط ميزانيتك الشهرية بالجنيه المصري. أدخل الدخل والمصاريف الثابتة والمرنة والادخار المخطط لمعرفة المتبقي من دخلك. الحاسبة مجانية ولا تحفظ أرقامك.';

export const Route = createFileRoute('/ar/egp-budget-calculator')({
  head: () => publicHead({
    lang: 'ar',
    enPath: '/egp-budget-calculator',
    title,
    description,
    schema: toolSchema('ar', '/egp-budget-calculator', title, description, egpBudgetFaqs.ar),
  }),
  component: EGPBudgetCalculatorRoute,
});

function EGPBudgetCalculatorRoute() {
  return <EGPBudgetCalculator />;
}
