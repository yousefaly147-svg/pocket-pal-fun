import type { Faq, TemplateLang } from './tool-content';

export const SITE_ORIGIN = 'https://pocketjr.lovable.app';
const publisher = { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'Pocketjr Finance', url: `${SITE_ORIGIN}/` };

export const localizedUrl = (lang: TemplateLang, enPath: string) => `${SITE_ORIGIN}${lang === 'ar' ? `/ar${enPath}` : enPath}`;

type HeadInput = {
  lang: TemplateLang;
  enPath: string;
  title: string;
  description: string;
  schema?: Record<string, unknown> | undefined;
};

/** Per-page head: self canonical, reciprocal en/ar/x-default alternates, OG + Twitter. */
export function publicHead({ lang, enPath, title, description, schema }: HeadInput) {
  const self = localizedUrl(lang, enPath);
  const en = localizedUrl('en', enPath);
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: self },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { property: 'og:locale', content: lang === 'ar' ? 'ar_EG' : 'en_US' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    links: [
      { rel: 'canonical', href: self },
      { rel: 'alternate', hrefLang: 'en', href: en },
      { rel: 'alternate', hrefLang: 'ar', href: localizedUrl('ar', enPath) },
      { rel: 'alternate', hrefLang: 'x-default', href: en },
    ],
    scripts: schema ? [{ type: 'application/ld+json', children: JSON.stringify(schema) }] : [],
  };
}

function breadcrumb(lang: TemplateLang, enPath: string, name: string) {
  const ar = lang === 'ar';
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: ar ? 'الرئيسية' : 'Home', item: ar ? `${SITE_ORIGIN}/ar` : `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: ar ? 'دليل المال' : 'Money guides', item: localizedUrl(lang, '/guides') },
      { '@type': 'ListItem', position: 3, name, item: localizedUrl(lang, enPath) },
    ],
  };
}

/** Free tool page: WebApplication + BreadcrumbList + FAQPage built from the visible FAQ. No ratings, offers or reviews. */
export function toolSchema(lang: TemplateLang, enPath: string, name: string, description: string, faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name,
        description,
        url: localizedUrl(lang, enPath),
        inLanguage: lang,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web browser',
        isAccessibleForFree: true,
        publisher,
      },
      breadcrumb(lang, enPath, name),
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };
}

/** Guide article: organisation author/publisher only, no invented people or dates. */
export function articleSchema(lang: TemplateLang, enPath: string, headline: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline,
        description,
        inLanguage: lang,
        mainEntityOfPage: localizedUrl(lang, enPath),
        author: publisher,
        publisher,
      },
      breadcrumb(lang, enPath, headline),
    ],
  };
}
