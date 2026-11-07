/** Public homepage entities only; no account data or unsupported commercial claims. */
export function websiteSchema(language: 'en' | 'ar') {
  const url = `https://pocketjr.lovable.app/${language === 'ar' ? 'ar' : ''}`;
  const description = language === 'ar'
    ? 'Pocketjr Finance أداة مجانية في متصفح الويب لتسجيل الدخل والصرف وتنظيم الميزانية ومتابعة أهداف الادخار وتسجيل الاستثمارات يدويًا. متاحة بالعربية والإنجليزية مع إمكانية اختيار العملة المعروضة.'
    : 'A free browser-based personal finance tracker for recording income and expenses, planning budgets, tracking savings goals and keeping manual investment records. Available in English and Arabic with a choice of currency display.';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': 'https://pocketjr.lovable.app/#website', name: 'Pocketjr Finance', url: 'https://pocketjr.lovable.app/', inLanguage: ['en', 'ar'], description },
      { '@type': 'SoftwareApplication', '@id': 'https://pocketjr.lovable.app/#application', name: 'Pocketjr Finance', url, applicationCategory: 'FinanceApplication', operatingSystem: 'Web browser', isAccessibleForFree: true, inLanguage: ['en', 'ar'], description },
    ],
  };
}