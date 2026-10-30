import { createFileRoute } from '@tanstack/react-router';
import { Index } from './index';

export const Route = createFileRoute('/ar/')({
  head: () => ({
    meta: [
      { title: 'Pocketjr Finance – تطبيق مجاني لإدارة المال وتتبع المصروفات' },
      { name: 'description', content: 'Pocketjr Finance أداة مجانية لإدارة المال الشخصي وتتبع الدخل والصرف والميزانية والاستثمارات وأهداف الادخار بالعربية والإنجليزية.' },
      { property: 'og:title', content: 'Pocketjr Finance – تطبيق مجاني لإدارة المال وتتبع المصروفات' },
      { property: 'og:description', content: 'Pocketjr Finance أداة مجانية لإدارة المال الشخصي وتتبع الدخل والصرف والميزانية والاستثمارات وأهداف الادخار بالعربية والإنجليزية.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:title', content: 'Pocketjr Finance – تطبيق مجاني لإدارة المال وتتبع المصروفات' },
      { name: 'twitter:description', content: 'Pocketjr Finance أداة مجانية لإدارة المال الشخصي وتتبع الدخل والصرف والميزانية والاستثمارات وأهداف الادخار بالعربية والإنجليزية.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/' },
    ],
  }),
  component: Index,
});
