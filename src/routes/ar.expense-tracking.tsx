import { createFileRoute } from '@tanstack/react-router';
import { GuideArticlePage } from '@/components/pocket/guide-article-page';
import { articleSchema } from '@/lib/public-seo';

export const Route = createFileRoute('/ar/expense-tracking')({
  head: () => ({
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(articleSchema('ar', '/expense-tracking', "إزاي تتابع وتقسم مصروفاتك | Pocketjr Finance", "اتعلم طريقة بسيطة لتسجيل الصرف اليومي وتقسيم المصروفات واكتشاف التكاليف المتكررة من غير جداول معقدة.")) }],
    meta: [
      { title: 'إزاي تتابع وتقسم مصروفاتك | Pocketjr Finance' },
      { name: 'description', content: 'اتعلم طريقة بسيطة لتسجيل الصرف اليومي وتقسيم المصروفات واكتشاف التكاليف المتكررة من غير جداول معقدة.' },
      { property: 'og:title', content: 'إزاي تتابع وتقسم مصروفاتك | Pocketjr Finance' },
      { property: 'og:description', content: 'اتعلم طريقة بسيطة لتسجيل الصرف اليومي وتقسيم المصروفات واكتشاف التكاليف المتكررة من غير جداول معقدة.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'إزاي تتابع وتقسم مصروفاتك | Pocketjr Finance' },
      { name: 'twitter:description', content: 'اتعلم طريقة بسيطة لتسجيل الصرف اليومي وتقسيم المصروفات واكتشاف التكاليف المتكررة من غير جداول معقدة.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/expense-tracking' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/expense-tracking' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/expense-tracking' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/expense-tracking' },
    ],
  }),
  component: ExpenseTrackingRoute,
});

function ExpenseTrackingRoute() {
  return <GuideArticlePage slug="expense-tracking" />;
}
