import { createFileRoute } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Pocketjr | A simpler way to understand your money' },
      { name: 'description', content: 'Learn about Pocketjr, a simple personal finance tool for recording spending, income, budgets and savings goals.' },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
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
          <h2>ما الذي لا يقدمه Pocketjr؟</h2>
          <p>Pocketjr مش بنك ولا محفظة دفع، ومش بيقدم نصائح مالية أو ضريبية أو استثمارية. هو أداة لتسجيل ومراجعة معلوماتك الشخصية، والقرارات المالية تفضل مسؤوليتك.</p>
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
          <h2>What Pocketjr is not</h2>
          <p>Pocketjr is not a bank or payment wallet, and it does not provide financial, tax or investment advice. It is a personal recordkeeping tool; financial decisions remain your responsibility.</p>
        </section>
        <p>For questions or support, email <a href="mailto:yousefaly147@gmail.com">yousefaly147@gmail.com</a>.</p>
      </>}
    </PublicPageLayout>
  );
}
