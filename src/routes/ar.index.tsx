import { createFileRoute } from '@tanstack/react-router';
import { Index } from './index';
import { websiteSchema } from '@/lib/website-schema';

export const Route = createFileRoute('/ar/')({
  head: () => ({
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(websiteSchema('ar')) }],
    meta: [
      { title: 'تتبع المصاريف والميزانية في مصر مجانًا | Pocketjr Finance' },
      { name: 'description', content: 'سجّل الدخل والصرف بالجنيه المصري، خطط ميزانية الشهر وتابع أهداف الادخار بالعربي أو الإنجليزي. ابدأ مجانًا من المتصفح من غير تحميل تطبيق.' },
      { property: 'og:title', content: 'تتبع المصاريف والميزانية في مصر مجانًا | Pocketjr Finance' },
      { property: 'og:description', content: 'سجّل الدخل والصرف بالجنيه المصري، خطط ميزانية الشهر وتابع أهداف الادخار بالعربي أو الإنجليزي. ابدأ مجانًا من المتصفح من غير تحميل تطبيق.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { property: 'og:url', content: 'https://pocketjr.lovable.app/ar' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'تتبع المصاريف والميزانية في مصر مجانًا | Pocketjr Finance' },
      { name: 'twitter:description', content: 'سجّل الدخل والصرف بالجنيه المصري، خطط ميزانية الشهر وتابع أهداف الادخار بالعربي أو الإنجليزي. ابدأ مجانًا من المتصفح من غير تحميل تطبيق.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/' },
    ],
  }),
  component: Index,
});
