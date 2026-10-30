import { createFileRoute } from '@tanstack/react-router';
import { HelpPage } from './help';

export const Route = createFileRoute('/ar/help')({
  head: () => ({
    meta: [
      { title: 'مساعدة Pocketjr والأسئلة الشائعة' },
      { name: 'description', content: 'إجابات عن حساب Pocketjr وتتبع المال ودعم اللغة العربية والخصوصية وحذف الحساب.' },
      { property: 'og:title', content: 'مساعدة Pocketjr والأسئلة الشائعة' },
      { property: 'og:description', content: 'إجابات عن حساب Pocketjr وتتبع المال ودعم اللغة العربية والخصوصية وحذف الحساب.' },
      { property: 'og:site_name', content: 'Pocketjr Money Tracker' },
      { name: 'twitter:title', content: 'مساعدة Pocketjr والأسئلة الشائعة' },
      { name: 'twitter:description', content: 'إجابات عن حساب Pocketjr وتتبع المال ودعم اللغة العربية والخصوصية وحذف الحساب.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/help' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/help' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/help' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/help' },
    ],
  }),
  component: HelpPage,
});
