/** Public homepage entities only; no account data or unsupported commercial claims. */
export function websiteSchema(language: 'en' | 'ar') {
  const url = `https://pocketjr.lovable.app/${language === 'ar' ? 'ar/' : ''}`;
  const description = language === 'ar'
    ? 'أداة مجانية في متصفح الويب لتسجيل الدخل والمصروفات والاستثمارات ومتابعة الميزانية وأهداف التحويش بالعربية والإنجليزية.'
    : 'A free web-browser tool for recording income, expenses and investments and tracking budgets and savings goals in English and Arabic.';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': 'https://pocketjr.lovable.app/#website', name: 'Pocketjr Finance', url: 'https://pocketjr.lovable.app/', inLanguage: ['en', 'ar'], description },
      { '@type': 'SoftwareApplication', '@id': 'https://pocketjr.lovable.app/#application', name: 'Pocketjr Finance', url, applicationCategory: 'FinanceApplication', operatingSystem: 'Web browser', isAccessibleForFree: true, inLanguage: ['en', 'ar'], description },
    ],
  };
}