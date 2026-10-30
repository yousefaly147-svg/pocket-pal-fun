import { createFileRoute } from '@tanstack/react-router';
import { AccountDeletionPage } from './delete-account';

export const Route = createFileRoute('/ar/delete-account')({
  head: () => ({
    meta: [
      { title: 'حذف حساب Pocketjr' },
      { name: 'description', content: 'ابدأ طلب حذف حساب Pocketjr والبيانات المرتبطة به بشكل دائم.' },
      { name: 'robots', content: 'noindex,follow' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/delete-account' },
    ],
  }),
  component: AccountDeletionPage,
});
