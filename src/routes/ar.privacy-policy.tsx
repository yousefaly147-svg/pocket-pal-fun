import { createFileRoute } from '@tanstack/react-router';
import { PrivacyPolicyPage } from './privacy-policy';

export const Route = createFileRoute('/ar/privacy-policy')({
  head: () => ({
    meta: [
      { title: 'سياسة الخصوصية | Pocketjr Finance' },
      { name: 'description', content: 'تعرف على كيفية تعامل Pocketjr Finance مع معلومات الحساب والبيانات المالية وطلبات حذف البيانات.' },
      { property: 'og:title', content: 'سياسة الخصوصية | Pocketjr Finance' },
      { property: 'og:description', content: 'تعرف على كيفية تعامل Pocketjr Finance مع معلومات الحساب والبيانات المالية وطلبات حذف البيانات.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:title', content: 'سياسة الخصوصية | Pocketjr Finance' },
      { name: 'twitter:description', content: 'تعرف على كيفية تعامل Pocketjr Finance مع معلومات الحساب والبيانات المالية وطلبات حذف البيانات.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/privacy-policy' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/privacy-policy' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/privacy-policy' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/privacy-policy' },
    ],
  }),
  component: PrivacyPolicyPage,
});
