import { createFileRoute } from '@tanstack/react-router';
import { ExpenseTemplatePage } from '@/components/pocket/expense-template-page';
import { publicHead, toolSchema } from '@/lib/public-seo';
import { templateFaqs } from '@/lib/tool-content';

const title = 'Free Monthly Expenses Excel Template (EGP) | Pocketjr Finance';
const description = 'Download a free monthly expenses Excel template in Egyptian pounds with planned vs actual totals, variance formulas and a daily expense log.';

export const Route = createFileRoute('/monthly-expenses-template')({
  head: () => publicHead({ lang: 'en', enPath: '/monthly-expenses-template', title, description, schema: toolSchema('en', '/monthly-expenses-template', title, description, templateFaqs['en']) }),
  component: ExpenseTemplatePage,
});
