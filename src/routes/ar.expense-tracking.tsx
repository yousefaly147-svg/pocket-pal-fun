import { createFileRoute } from '@tanstack/react-router';
import { GuideArticlePage } from '@/components/pocket/guide-article-page';
import { articleSchema } from '@/lib/public-seo';

export const Route = createFileRoute('/ar/expense-tracking')({
  head: () => ({
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(articleSchema('ar', '/expense-tracking', "تتبع المصاريف: تطبيق ولا جدول؟ | Pocketjr Finance", "اتعلم تسجل مصاريفك اليومية، وتختار تصنيفات واضحة، وتراجع المصاريف المتكررة، وتقارن بين جدول Excel وتطبيق لمتابعة الفلوس.")) }],
    meta: [
      { title: 'تتبع المصاريف: تطبيق ولا جدول؟ | Pocketjr Finance' },
      { name: 'description', content: 'اتعلم تسجل مصاريفك اليومية، وتختار تصنيفات واضحة، وتراجع المصاريف المتكررة، وتقارن بين جدول Excel وتطبيق لمتابعة الفلوس.' },
      { property: 'og:title', content: 'تتبع المصاريف: تطبيق ولا جدول؟ | Pocketjr Finance' },
      { property: 'og:description', content: 'اتعلم تسجل مصاريفك اليومية، وتختار تصنيفات واضحة، وتراجع المصاريف المتكررة، وتقارن بين جدول Excel وتطبيق لمتابعة الفلوس.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'تتبع المصاريف: تطبيق ولا جدول؟ | Pocketjr Finance' },
      { name: 'twitter:description', content: 'اتعلم تسجل مصاريفك اليومية، وتختار تصنيفات واضحة، وتراجع المصاريف المتكررة، وتقارن بين جدول Excel وتطبيق لمتابعة الفلوس.' },
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
