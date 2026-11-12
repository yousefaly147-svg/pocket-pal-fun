import { createFileRoute } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Pocketjr Finance | A simpler way to understand your money' },
      { name: 'description', content: 'Learn about Pocketjr Finance, a simple personal finance tool for recording spending, income, budgets and savings goals.' },
      { property: 'og:title', content: 'About Pocketjr Finance | A simpler way to understand your money' },
      { property: 'og:description', content: 'Learn how Pocketjr Finance helps you record income, spending, budgets and savings goals.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:title', content: 'About Pocketjr Finance' },
      { name: 'twitter:description', content: 'A simple personal finance tool for everyday money tracking.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/about' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/about' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/about' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/about' },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  return (
    <PublicPageLayout
      title={ar ? 'عن Pocketjr' : 'About Pocketjr'}
      description={ar ? 'أداة بسيطة تساعدك تتابع فلوسك وتفهم عادات الصرف والادخار.' : 'A simple personal finance tool designed to help you keep track of your money and understand your habits.'}
    >
      {ar ? <>
        <section>
          <h2>فكرتنا</h2>
          <p>Pocketjr مشروع هدفه يخلي متابعة الفلوس اليومية أسهل وأوضح. تقدر تسجل الدخل والصرف، تراجع معاملاتك، وتتابع الميزانية والأهداف الادخارية في مكان واحد.</p>
        </section>
        <section>
          <h2>مصمم للاستخدام اليومي</h2>
          <p>بنركز على تجربة سهلة وواضحة، مع دعم العربية والإنجليزية. تقدر تبدأ كضيف أو تستخدم حسابًا لمزامنة بياناتك حسب المزايا المتاحة في الخدمة.</p>
        </section>
        <section>
          <h2>كيف يعمل Pocketjr؟</h2>
          <ul>
            <li>تسجّل الدخل والصرف والاستثمارات يدويًا، والموقع لا يتصل بكل البنوك ولا يقرأ إشعارات أندرويد.</li>
            <li>الميزانية والأهداف الادخارية أدوات للتخطيط والمتابعة فقط، ولا تحتفظ بأموال حقيقية ولا تنقلها.</li>
            <li>بيانات وضع الضيف تبقى على هذا الجهاز/المتصفح فقط، أما بيانات الحساب فتتزامن عبر الأجهزة المدعومة عند تسجيل الدخول.</li>
            <li>تغيير رمز العملة المعروض لا يحوّل المبالغ المسجلة.</li>
            <li>استيراد إشعارات تيلدا اختياري ومتاح فقط في تطبيق أندرويد المتوافق بعد منح إذن الوصول إلى الإشعارات.</li>
          </ul>
          <p>ابدأ من <a href="/ar/monthly-budget">دليل الميزانية الشهرية</a> أو <a href="/ar/daily-budget-calculator">حاسبة الميزانية اليومية</a> أو <a href="/ar/monthly-expenses-template">جدول المصاريف الشهرية</a>، أو تصفح <a href="/ar/guides">كل الأدلة</a>.</p>
        </section>
        <section>
          <h2>ما الذي لا يقدمه Pocketjr؟</h2>
          <p>Pocketjr مش بنك ولا محفظة دفع ولا مستشار مالي، ومش بيقدم نصائح مالية أو ضريبية أو استثمارية. هو أداة لتسجيل ومراجعة معلوماتك الشخصية، والقرارات المالية تفضل مسؤوليتك.</p>
        </section>
        <p>للاستفسارات أو الدعم: <a href="mailto:yousefaly147@gmail.com">yousefaly147@gmail.com</a>.</p>
      </> : <>
        <section>
          <h2>Our purpose</h2>
          <p>Pocketjr is a project built to make everyday money tracking feel simpler and clearer. Record income and spending, review transactions, and keep an eye on budgets and savings goals in one place.</p>
        </section>
        <section>
          <h2>Made for everyday use</h2>
          <p>We focus on a straightforward experience with English and Arabic support. You can start as a guest or use an account to sync your information across supported devices.</p>
        </section>
        <section>
          <h2>How Pocketjr works</h2>
          <ul>
            <li>You enter income, expenses and investments manually. The website does not connect to all banks and does not read Android notifications.</li>
            <li>Budgets and savings goals are planning and tracking tools only; they do not hold or move real money.</li>
            <li>Guest records stay on the current device and browser. Signed-in data syncs to your account across supported signed-in devices.</li>
            <li>Changing the displayed currency label does not convert amounts you have already recorded.</li>
            <li>Optional Telda notification import is available only in the compatible Android app, after you grant Android notification access.</li>
          </ul>
          <p>Get started with the <a href="/monthly-budget">monthly budget guide</a>, the <a href="/daily-budget-calculator">daily budget calculator</a> or the <a href="/monthly-expenses-template">monthly expenses template</a>, or browse <a href="/guides">all guides</a>.</p>
        </section>
        <section>
          <h2>What Pocketjr is not</h2>
          <p>Pocketjr is not a bank, payment wallet or financial adviser, and it does not provide financial, tax or investment advice. It is a personal recordkeeping tool; financial decisions remain your responsibility.</p>
        </section>
        <p>For questions or support, email <a href="mailto:yousefaly147@gmail.com">yousefaly147@gmail.com</a>.</p>
      </>}
    </PublicPageLayout>
  );
}
