import { createFileRoute } from '@tanstack/react-router';
import { GuidesPage } from './guides';

export const Route = createFileRoute('/ar/guides')({
  head: () => ({
    meta: [
      { title: 'دليل الميزانية وتتبع المصروفات والادخار | Pocketjr Finance' },
      { name: 'description', content: 'أدلة عملية عن تنظيم الميزانية بالجنيه المصري، ومتابعة المصروفات اليومية، وتقسيم الصرف، وتحديد أهداف ادخار واقعية.' },
      { property: 'og:title', content: 'دليل الميزانية وتتبع المصروفات والادخار | Pocketjr Finance' },
      { property: 'og:description', content: 'أدلة عملية عن تنظيم الميزانية بالجنيه المصري، ومتابعة المصروفات اليومية، وتقسيم الصرف، وتحديد أهداف ادخار واقعية.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'دليل الميزانية وتتبع المصروفات والادخار | Pocketjr Finance' },
      { name: 'twitter:description', content: 'أدلة عملية عن تنظيم الميزانية بالجنيه المصري، ومتابعة المصروفات اليومية، وتقسيم الصرف، وتحديد أهداف ادخار واقعية.' },
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
