import { createFileRoute } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/help')({
  head: () => ({
    meta: [
      { title: 'Pocketjr Finance Help & FAQ | Frequently asked questions' },
      { name: 'description', content: 'Answers about Pocketjr Finance accounts, money tracking, Arabic language support, privacy and account deletion.' },
      { property: 'og:title', content: 'Pocketjr Finance Help & FAQ' },
      { property: 'og:description', content: 'Quick answers about Pocketjr Finance accounts, finance tracking, language settings and privacy.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:title', content: 'Pocketjr Finance Help & FAQ' },
      { name: 'twitter:description', content: 'Get answers about using Pocketjr and managing your account.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/help' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/help' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/help' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/help' },
    ],
  }),
  component: HelpPage,
});

export function HelpPage() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  const items = ar ? [
    ['ما هو Pocketjr؟', 'أداة لتسجيل الدخل والصرف والمعاملات ومتابعة الميزانية والأهداف الادخارية.'],
    ['هل Pocketjr بنك أو محفظة إلكترونية؟', 'لا. Pocketjr ليس بنكًا ولا ينفذ التحويلات أو المدفوعات.'],
    ['هل أحتاج إلى إنشاء حساب؟', 'يمكنك بدء الاستخدام كضيف. إنشاء حساب يتيح مزايا الحساب والمزامنة المدعومة.'],
    ['هل يتصل Pocketjr بكل البنوك تلقائيًا؟', 'لا. لا ندّعي وجود اتصال مصرفي شامل. يوجد خيار اختياري لاستيراد إشعارات تيلدا على أندرويد عند تفعيله ومنح الإذن المطلوب.'],
    ['أين تُحفظ بياناتي؟', 'في وضع الضيف تبقى السجلات على هذا الجهاز/المتصفح فقط. عند تسجيل الدخول تتزامن بياناتك مع حسابك عبر الأجهزة المدعومة التي سجلت الدخول منها.'],
    ['هل ينقل Pocketjr أموالًا حقيقية؟', 'لا. تسجّل الدخل والصرف والاستثمارات يدويًا، والميزانية والأهداف الادخارية أدوات تخطيط ومتابعة فقط ولا تحتفظ بأموال أو تنقلها.'],
    ['هل تغيير العملة يحوّل المبالغ؟', 'لا. تغيير رمز العملة المعروض لا يحوّل المبالغ المسجلة، بل يغيّر الرمز الظاهر فقط.'],
    ['هل يقرأ الموقع إشعاراتي؟', 'لا. الموقع لا يقرأ إشعارات أندرويد. استيراد إشعارات تيلدا متاح فقط في تطبيق أندرويد المتوافق بعد منح إذن الوصول إلى الإشعارات.'],
    ['هل يقدم Pocketjr نصائح مالية؟', 'لا. Pocketjr أداة لتسجيل المعلومات ومراجعتها، وليس مستشارًا ماليًا.'],
    ['هل يدعم العربية؟', 'نعم، يمكنك التبديل بين العربية والإنجليزية من زر اللغة.'],
    ['كيف أحذف حسابي؟', 'افتح صفحة حذف الحساب من الموقع أو استخدم خيار الحذف في إعدادات Pocketjr، واتبع خطوات التحقق.'],
    ['كيف أتواصل مع الدعم؟', 'راسلنا على yousefaly147@gmail.com.'],
  ] : [
    ['What is Pocketjr?', 'Pocketjr is a personal tool for recording income, spending and transactions, and keeping track of budgets and savings goals.'],
    ['Is Pocketjr a bank or payment wallet?', 'No. Pocketjr is not a bank and does not execute transfers or payments.'],
    ['Do I need an account?', 'You can start in guest mode. Creating an account enables the account and sync features supported by the service.'],
    ['Does Pocketjr connect automatically to every bank?', 'No. We do not claim universal bank connectivity. An optional Telda notification import is available on Android when enabled and the required permission is granted.'],
    ['Where is my data stored?', 'In guest mode, records stay on the current device and browser only. When you sign in, your data syncs to your account across supported signed-in devices.'],
    ['Does Pocketjr move real money?', 'No. You enter income, expenses and investments manually. Budgets and savings goals are planning and tracking tools; they do not hold or move funds.'],
    ['Does changing the currency convert my amounts?', 'No. Changing the displayed currency label does not convert amounts you have already recorded; only the label changes.'],
    ['Does the website read my notifications?', 'No. The website does not read Android notifications. Telda notification import is only available in the compatible Android app after you grant notification access.'],
    ['Does Pocketjr give financial advice?', 'No. Pocketjr is a recordkeeping tool, not a financial adviser.'],
    ['Does Pocketjr support Arabic?', 'Yes. You can switch between Arabic and English using the language control.'],
    ['How can I delete my account?', 'Open the account deletion page from the website or use the deletion option in Pocketjr settings, then follow the verification steps.'],
    ['How can I contact support?', 'Email us at yousefaly147@gmail.com.'],
  ];
  return (
    <PublicPageLayout
      title={ar ? 'المساعدة والأسئلة الشائعة' : 'Help & frequently asked questions'}
      description={ar ? 'إجابات سريعة عن استخدام Pocketjr والخصوصية والحساب.' : 'Quick answers about using Pocketjr, accounts and privacy.'}
    >
      <div className="public-faq-list">
        {items.map(([question, answer]) => (
          <section className="public-faq-item" key={question}>
            <h2>{question}</h2>
            <p>{answer}</p>
          </section>
        ))}
      </div>
      <p>{ar ? <>أدوات مفيدة: <a href="/ar/egp-budget-calculator">حاسبة الميزانية بالجنيه</a>، <a href="/ar/daily-budget-calculator">حاسبة الميزانية اليومية</a>، <a href="/ar/savings-goals">دليل الأهداف الادخارية</a>، و<a href="/ar/guides">كل الأدلة</a>.</> : <>Helpful tools: the <a href="/egp-budget-calculator">EGP budget calculator</a>, <a href="/daily-budget-calculator">daily budget calculator</a>, <a href="/savings-goals">savings goals guide</a> and <a href="/guides">all guides</a>.</>}</p>
      <p>{ar ? 'للاستفسارات الأخرى، راسلنا على ' : 'For anything else, contact us at '}<a href="mailto:yousefaly147@gmail.com">yousefaly147@gmail.com</a>.</p>
    </PublicPageLayout>
  );
}
