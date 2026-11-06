/** Public homepage entities only; no account data or unsupported commercial claims. */
export function websiteSchema(language: 'en' | 'ar') {
  const url = `https://pocketjr.lovable.app/${language === 'ar' ? 'ar' : ''}`;
  const description = language === 'ar'
    ? 'Pocketjr Finance أداة مجانية في متصفح الويب لتتبع المصاريف وإدارة الميزانية في مصر. سجّل الدخل والصرف بالجنيه المصري وتابع الاستثمارات وأهداف الادخار بالعربية والإنجليزية، وابدأ من غير تحميل تطبيق.'
    : 'A free browser-based expense tracker and personal money manager for people in Egypt. Record income, daily expenses and investments, plan budgets and savings goals in English or Arabic; start without downloading an app.';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': 'https://pocketjr.lovable.app/#website', name: 'Pocketjr Finance', url: 'https://pocketjr.lovable.app/', inLanguage: ['en', 'ar'], description },
      { '@type': 'SoftwareApplication', '@id': 'https://pocketjr.lovable.app/#application', name: 'Pocketjr Finance', url, applicationCategory: 'FinanceApplication', operatingSystem: 'Web browser', isAccessibleForFree: true, inLanguage: ['en', 'ar'], description },
    ],
  };
}