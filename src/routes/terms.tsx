import { createFileRoute } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms of Use | Pocketjr' },
      { name: 'description', content: 'Read the terms that apply when using the Pocketjr website and personal finance tools.' },
      { property: 'og:title', content: 'Terms of Use | Pocketjr' },
      { property: 'og:description', content: 'Read the terms for using the Pocketjr website and personal finance tools.' },
      { name: 'twitter:title', content: 'Terms of Use | Pocketjr' },
      { name: 'twitter:description', content: 'Terms for using Pocketjr.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/terms' },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  return (
    <PublicPageLayout
      title={ar ? 'شروط الاستخدام' : 'Terms of Use'}
      description={ar ? 'آخر تحديث: 30 أكتوبر 2026. يرجى قراءة الشروط قبل استخدام Pocketjr.' : 'Last updated: 30 October 2026. Please read these terms before using Pocketjr.'}
    >
      {ar ? <>
        <section><h2>1. استخدام الخدمة</h2><p>يوفر Pocketjr أدوات لتسجيل ومراجعة معلوماتك المالية الشخصية. يجب استخدام الخدمة بطريقة قانونية ومسؤولة، وعدم محاولة تعطيلها أو الوصول غير المصرح به إلى حسابات أو بيانات الآخرين.</p></section>
        <section><h2>2. دقة المعلومات</h2><p>أنت مسؤول عن مراجعة البيانات والمبالغ والتواريخ التي تدخلها. قد تحدث أخطاء أو انقطاعات تقنية؛ لذلك لا تعتمد على Pocketjr كسجل رسمي أو مصدر وحيد لاتخاذ قرارات مالية مهمة.</p></section>
        <section><h2>3. لا توجد نصائح مالية</h2><p>Pocketjr ليس بنكًا أو مستشارًا ماليًا أو ضريبيًا أو استثماريًا. أي أمثلة أو أدلة تعليمية عامة ولا تراعي ظروفك الفردية ولا تمثل توصية.</p></section>
        <section><h2>4. الحساب والخصوصية</h2><p>أنت مسؤول عن حماية بيانات تسجيل الدخول واستخدام ميزات الحساب بشكل آمن. توضح <a href="/privacy-policy">سياسة الخصوصية</a> كيفية التعامل مع المعلومات وطرق طلب حذف الحساب.</p></section>
        <section><h2>5. توفر الخدمة والتغييرات</h2><p>قد نضيف ميزات أو نعدلها أو نوقف أجزاء من الخدمة لتحسينها أو لصيانتها. لا نضمن أن الخدمة ستعمل دون انقطاع أو أخطاء في جميع الأوقات.</p></section>
        <section><h2>6. خدمات وروابط خارجية</h2><p>قد تتضمن الخدمة روابط أو خدمات مقدمة من أطراف أخرى. تخضع هذه الخدمات لشروط وسياسات الجهات المقدمة لها، ولسنا مسؤولين عن محتواها أو توفرها.</p></section>
        <section><h2>7. التواصل</h2><p>للاستفسارات المتعلقة بهذه الشروط، راسلنا على <a href="mailto:yousefaly147@gmail.com">yousefaly147@gmail.com</a>.</p></section>
      </> : <>
        <section><h2>1. Using the service</h2><p>Pocketjr provides tools for recording and reviewing your personal finance information. Use the service lawfully and responsibly. Do not attempt to disrupt it or access another person's account or information without permission.</p></section>
        <section><h2>2. Accuracy of information</h2><p>You are responsible for checking the amounts, dates and other information you enter. Technical errors or interruptions may occur, so do not treat Pocketjr as an official record or the only source for important financial decisions.</p></section>
        <section><h2>3. No financial advice</h2><p>Pocketjr is not a bank or a financial, tax or investment adviser. Any examples and educational guides are general information, do not account for your individual circumstances and are not recommendations.</p></section>
        <section><h2>4. Accounts and privacy</h2><p>You are responsible for protecting your sign-in details and using account features securely. Our <a href="/privacy-policy">Privacy Policy</a> explains how information is handled and how to request account deletion.</p></section>
        <section><h2>5. Service availability and changes</h2><p>We may add, change or discontinue parts of the service for improvements or maintenance. We do not guarantee that the service will be uninterrupted or error-free at all times.</p></section>
        <section><h2>6. Third-party services and links</h2><p>The service may include links to or features provided by third parties. Those services are governed by their providers' own terms and policies; we are not responsible for their content or availability.</p></section>
        <section><h2>7. Contact</h2><p>For questions about these terms, email <a href="mailto:yousefaly147@gmail.com">yousefaly147@gmail.com</a>.</p></section>
      </>}
    </PublicPageLayout>
  );
}
