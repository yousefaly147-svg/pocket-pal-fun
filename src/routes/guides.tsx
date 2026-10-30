import { createFileRoute, Link } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/guides')({
  head: () => ({
    meta: [
      { title: 'Personal Finance Guides | Pocketjr' },
      { name: 'description', content: 'Practical beginner guides to making a budget, tracking expenses and setting savings goals.' },
    ],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  const guides = ar ? [
    { to: '/guides/monthly-budget' as const, title: 'إزاي تعمل ميزانية شهرية بسيطة', description: 'خطوات عملية لتقسيم الدخل ومراجعة المصروفات من غير تعقيد.' },
    { to: '/guides/expense-tracking' as const, title: 'إزاي تتابع وتقسم مصروفاتك', description: 'طريقة سهلة لتصنيف الصرف واكتشاف الأنماط المتكررة.' },
    { to: '/guides/savings-goals' as const, title: 'إزاي تحدد هدف ادخار واقعي', description: 'حوّل هدفك الكبير لخطوات صغيرة تقدر تراجعها.' },
  ] : [
    { to: '/guides/monthly-budget' as const, title: 'How to make a simple monthly budget', description: 'Practical steps for planning income and reviewing spending without making it complicated.' },
    { to: '/guides/expense-tracking' as const, title: 'How to track and categorize expenses', description: 'A straightforward way to group spending and spot recurring patterns.' },
    { to: '/guides/savings-goals' as const, title: 'How to set a realistic savings goal', description: 'Turn a larger goal into small steps you can review and adjust.' },
  ];
  return (
    <PublicPageLayout
      title={ar ? 'دليل المال الشخصي' : 'Personal finance guides'}
      description={ar ? 'مقالات تعليمية بسيطة تساعدك تنظم الميزانية وتفهم الصرف وتخطط للادخار.' : 'Practical, beginner-friendly articles to help you plan a budget, understand spending and work toward savings goals.'}
    >
      <div className="public-guide-grid">
        {guides.map((guide) => (
          <Link to={guide.to} className="public-guide-card" key={guide.to}>
            <span>{ar ? 'اقرأ الدليل' : 'Read the guide'} →</span>
            <h2>{guide.title}</h2>
            <p>{guide.description}</p>
          </Link>
        ))}
      </div>
      <p className="public-content-note">
        {ar ? 'المحتوى للتثقيف العام فقط، وليس نصيحة مالية أو ضريبية أو استثمارية.' : 'These guides are for general education only and are not financial, tax or investment advice.'}
      </p>
    </PublicPageLayout>
  );
}
