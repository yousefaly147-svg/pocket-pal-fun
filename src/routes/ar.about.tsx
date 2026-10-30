import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from './about';

export const Route = createFileRoute('/ar/about')({
  head: () => ({
    meta: [
      { title: 'عن Pocketjr | أداة بسيطة لمتابعة أموالك' },
      { name: 'description', content: 'تعرف على Pocketjr، أداة مجانية لتسجيل الدخل والصرف ومتابعة الميزانية والأهداف الادخارية.' },
      { property: 'og:title', content: 'عن Pocketjr | أداة بسيطة لمتابعة أموالك' },
      { property: 'og:description', content: 'تعرف على Pocketjr، أداة مجانية لتسجيل الدخل والصرف ومتابعة الميزانية والأهداف الادخارية.' },
      { property: 'og:site_name', content: 'Pocketjr Money Tracker' },
      { name: 'twitter:title', content: 'عن Pocketjr | أداة بسيطة لمتابعة أموالك' },
      { name: 'twitter:description', content: 'تعرف على Pocketjr، أداة مجانية لتسجيل الدخل والصرف ومتابعة الميزانية والأهداف الادخارية.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/about' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/about' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/about' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/about' },
    ],
  }),
  component: AboutPage,
});
