import { createFileRoute } from '@tanstack/react-router';
import { GuidesPage } from './guides';

export const Route = createFileRoute('/ar/guides')({
  head: () => ({
    meta: [
      { title: 'دليل الميزانية وتتبع المصروفات والادخار | Pocketjr Finance' },
      { name: 'description', content: 'أدلة عملية عن تنظيم الميزانية وتتبع المصروفات اليومية وتحديد أهداف ادخار واقعية، مع أدوات إضافية للتخطيط بالجنيه المصري.' },
      { property: 'og:title', content: 'دليل الميزانية وتتبع المصروفات والادخار | Pocketjr Finance' },
      { property: 'og:description', content: 'أدلة عملية عن تنظيم الميزانية وتتبع المصروفات اليومية وتحديد أهداف ادخار واقعية، مع أدوات إضافية للتخطيط بالجنيه المصري.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'دليل الميزانية وتتبع المصروفات والادخار | Pocketjr Finance' },
      { name: 'twitter:description', content: 'أدلة عملية عن تنظيم الميزانية وتتبع المصروفات اليومية وتحديد أهداف ادخار واقعية، مع أدوات إضافية للتخطيط بالجنيه المصري.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/guides' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/guides' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/guides' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/guides' },
    ],
  }),
  component: GuidesPage,
});
