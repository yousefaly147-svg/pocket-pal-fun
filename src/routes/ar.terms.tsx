import { createFileRoute } from '@tanstack/react-router';
import { TermsPage } from './terms';

export const Route = createFileRoute('/ar/terms')({
  head: () => ({
    meta: [
      { title: 'شروط الاستخدام | Pocketjr Finance' },
      { name: 'description', content: 'اقرأ شروط استخدام موقع Pocketjr Finance وأدوات إدارة المال الشخصي.' },
      { property: 'og:title', content: 'شروط الاستخدام | Pocketjr Finance' },
      { property: 'og:description', content: 'اقرأ شروط استخدام موقع Pocketjr Finance وأدوات إدارة المال الشخصي.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:title', content: 'شروط الاستخدام | Pocketjr Finance' },
      { name: 'twitter:description', content: 'اقرأ شروط استخدام موقع Pocketjr Finance وأدوات إدارة المال الشخصي.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/terms' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/terms' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/terms' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/terms' },
    ],
  }),
  component: TermsPage,
});
