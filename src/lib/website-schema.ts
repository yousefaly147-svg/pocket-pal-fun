/** Public homepage entities only; no account data or unsupported commercial claims. */
const SITE_ORIGIN = 'https://pocketjr.lovable.app';
const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;

export function websiteSchema(language: 'en' | 'ar') {
  const url = language === 'ar' ? `${SITE_ORIGIN}/ar` : `${SITE_ORIGIN}/`;
  const description = language === 'ar'
    ? 'Pocketjr Finance أداة مجانية في متصفح الويب لتسجيل الدخل والصرف وتنظيم الميزانية ومتابعة أهداف الادخار وتسجيل الاستثمارات يدويًا. متاحة بالعربية والإنجليزية مع إمكانية اختيار العملة المعروضة.'
    : 'A free browser-based personal finance tracker for recording income and expenses, planning budgets, tracking savings goals and keeping manual investment records. Available in English and Arabic with a choice of currency display.';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': ORGANIZATION_ID, name: 'Pocketjr Finance', url: `${SITE_ORIGIN}/` },
      { '@type': 'WebSite', '@id': `${SITE_ORIGIN}/#website`, name: 'Pocketjr Finance', url: `${SITE_ORIGIN}/`, inLanguage: ['en', 'ar'], description, publisher: { '@id': ORGANIZATION_ID } },
      { '@type': 'SoftwareApplication', '@id': `${SITE_ORIGIN}/#application`, name: 'Pocketjr Finance', url, applicationCategory: 'FinanceApplication', operatingSystem: 'Web browser', isAccessibleForFree: true, inLanguage: ['en', 'ar'], description, publisher: { '@id': ORGANIZATION_ID } },
    ],
  };
}