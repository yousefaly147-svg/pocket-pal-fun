import { createFileRoute } from '@tanstack/react-router';
import { Index } from './index';
import { websiteSchema } from '@/lib/website-schema';

export const Route = createFileRoute('/ar/')({
  head: () => ({
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(websiteSchema('ar')) }],
    meta: [
      { title: 'Pocketjr Finance – تطبيق مجاني لإدارة المال وتتبع المصروفات' },
      { name: 'description', content: 'Pocketjr Finance أداة مجانية لإدارة المال الشخصي وتتبع الدخل والصرف والميزانية والاستثمارات وأهداف الادخار بالعربية والإنجليزية.' },
      { property: 'og:title', content: 'Pocketjr Finance – تطبيق مجاني لإدارة المال وتتبع المصروفات' },
      { property: 'og:description', content: 'Pocketjr Finance أداة مجانية لإدارة المال الشخصي وتتبع الدخل والصرف والميزانية والاستثمارات وأهداف الادخار بالعربية والإنجليزية.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { property: 'og:url', content: 'https://pocketjr.lovable.app/ar/' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
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
