/** Public homepage entities only; no account data or unsupported commercial claims. */
export function websiteSchema(language: 'en' | 'ar') {
  const url = `https://pocketjr.lovable.app/${language === 'ar' ? 'ar/' : ''}`;
  const description = language === 'ar'
    ? 'Pocketjr Finance أداة مجانية في متصفح الويب لإدارة المال الشخصي في مصر وتسجيل الدخل والصرف والاستثمارات ومتابعة الميزانية وأهداف الادخار بالعربية والإنجليزية.'
    : 'A free browser-based personal money manager for people in Egypt to record income, expenses and investments and track budgets and savings goals in English and Arabic.';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': 'https://pocketjr.lovable.app/#website', name: 'Pocketjr Finance', url: 'https://pocketjr.lovable.app/', inLanguage: ['en', 'ar'], description },
      { '@type': 'SoftwareApplication', '@id': 'https://pocketjr.lovable.app/#application', name: 'Pocketjr Finance', url, applicationCategory: 'FinanceApplication', operatingSystem: 'Web browser', isAccessibleForFree: true, inLanguage: ['en', 'ar'], description },
    ],
  };
}