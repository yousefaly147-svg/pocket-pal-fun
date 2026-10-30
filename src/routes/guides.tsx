import { createFileRoute, Link } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/guides')({
  head: () => ({
    meta: [
      { title: 'Free Budgeting, Expense Tracking and Savings Guides | Pocketjr Finance' },
      { name: 'description', content: 'Practical personal finance guides for making a monthly budget in Egypt, tracking daily expenses and setting realistic savings goals.' },
      { property: 'og:title', content: 'Budgeting & Expense Tracking Guides | Pocketjr Finance' },
      { property: 'og:description', content: 'Practical guides to budgeting in Egypt, tracking expenses and setting realistic savings goals.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Budgeting & Expense Tracking Guides | Pocketjr Finance' },
      { name: 'twitter:description', content: 'Practical guides to budgeting in Egypt, tracking expenses and setting realistic savings goals.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/guides' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/guides' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/guides' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/guides' },
    ],
  }),
  component: GuidesPage,
});

export function GuidesPage() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  const items = ar
    ? [
        { to: '/ar/monthly-budget' as const, title: 'إزاي تعمل ميزانية شهرية في مصر', description: 'خطوات عملية لتنظيم الدخل والمصروفات بالجنيه المصري ومراجعة الخطة كل أسبوع.' },
        { to: '/ar/expense-tracking' as const, title: 'إزاي تتابع وتقسم مصروفاتك', description: 'طريقة بسيطة لتسجيل الصرف اليومي واكتشاف المصاريف المتكررة.' },
        { to: '/ar/savings-goals' as const, title: 'إزاي تحدد هدف ادخار واقعي', description: 'حوّل هدف الادخار لمبلغ شهري وموعد مناسب لظروفك.' },
      ]
    : [
        { to: '/monthly-budget' as const, title: 'How to make a monthly budget in Egypt', description: 'Plan income and expenses in EGP, set flexible spending limits and review your plan.' },
        { to: '/expense-tracking' as const, title: 'How to track and categorize expenses', description: 'Build a simple daily expense tracking habit and spot recurring costs.' },
        { to: '/savings-goals' as const, title: 'How to set a realistic savings goal', description: 'Turn a savings target into a manageable monthly plan.' },
      ];

  return (
    <PublicPageLayout
      title={ar ? 'دليل الميزانية وتتبع المصروفات والادخار' : 'Budgeting, expense tracking and savings guides'}
      description={ar
        ? 'مقالات عملية تساعدك تنظم الميزانية بالجنيه المصري وتفهم الصرف وتخطط للادخار.'
        : 'Practical, beginner-friendly articles to help you plan a budget in Egypt, understand spending and work toward savings goals.'}
    >
      <nav className="public-guide-grid" aria-label={ar ? 'موضوعات الدليل' : 'Guide topics'}>
        {items.map((item) => (
          <Link key={item.to} className="public-guide-card" to={item.to}>
            <span>{ar ? 'دليل عملي' : 'Practical guide'}</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <span>{ar ? 'اقرأ الدليل ←' : 'Read the guide →'}</span>
          </Link>
        ))}
      </nav>
      <p className="public-content-note">
        {ar
          ? 'المحتوى للتثقيف العام فقط، وليس نصيحة مالية أو ضريبية أو استثمارية.'
          : 'The guides are for general education only and are not financial, tax or investment advice.'}
      </p>
    </PublicPageLayout>
  );
}
