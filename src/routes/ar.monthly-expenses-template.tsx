import { createFileRoute } from '@tanstack/react-router';
import { ExpenseTemplatePage } from '@/components/pocket/expense-template-page';
import { publicHead, toolSchema } from '@/lib/public-seo';
import { templateFaqs } from '@/lib/tool-content';

const title = 'جدول مصاريف شهرية Excel جاهز مجانًا | Pocketjr Finance';
const description = 'حمّل جدول مصاريف شهرية Excel جاهز بالجنيه المصري لميزانية البيت: مخطط مقابل فعلي ومعادلات للفرق وسجل للصرف اليومي.';

export const Route = createFileRoute('/ar/monthly-expenses-template')({
  head: () => publicHead({ lang: 'ar', enPath: '/monthly-expenses-template', title, description, schema: toolSchema('ar', '/monthly-expenses-template', title, description, templateFaqs['ar']) }),
  component: ExpenseTemplatePage,
});
