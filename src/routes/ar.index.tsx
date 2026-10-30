import { createFileRoute } from '@tanstack/react-router';
import { Index } from './index';

export const Route = createFileRoute('/ar/')({
  head: () => ({
    meta: [
      { title: 'Pocketjr – تطبيق مجاني لتتبع المصروفات وتنظيم الميزانية' },
      { name: 'description', content: 'تابع الدخل والصرف والاستثمارات والميزانية وأهداف الادخار مع Pocketjr، أداة مجانية لإدارة المال الشخصي بالعربية والإنجليزية.' },
      { property: 'og:title', content: 'Pocketjr – تطبيق مجاني لتتبع المصروفات وتنظيم الميزانية' },
      { property: 'og:description', content: 'تابع الدخل والصرف والاستثمارات والميزانية وأهداف الادخار مع Pocketjr، أداة مجانية لإدارة المال الشخصي بالعربية والإنجليزية.' },
      { property: 'og:site_name', content: 'Pocketjr Money Tracker' },
      { name: 'twitter:title', content: 'Pocketjr – تطبيق مجاني لتتبع المصروفات وتنظيم الميزانية' },
      { name: 'twitter:description', content: 'تابع الدخل والصرف والاستثمارات والميزانية وأهداف الادخار مع Pocketjr، أداة مجانية لإدارة المال الشخصي بالعربية والإنجليزية.' },
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
