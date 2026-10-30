import { createFileRoute } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/guides/monthly-budget')({
  head: () => ({
    meta: [
      { title: 'How to Make a Simple Monthly Budget | Pocketjr' },
      { name: 'description', content: 'Learn a practical five-step method for planning monthly income, expenses and savings.' },
    ],
  }),
  component: MonthlyBudgetGuide,
});

function MonthlyBudgetGuide() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  return (
    <PublicPageLayout
      title={ar ? 'إزاي تعمل ميزانية شهرية بسيطة' : 'How to make a simple monthly budget'}
      description={ar ? 'الميزانية مش لازم تكون معقدة. الفكرة إنك تعرف دخلك رايح فين وتخطط قبل ما الشهر يبدأ.' : 'A budget does not need to be complicated. The aim is to understand where your money goes and make a plan before the month begins.'}
    >
      {ar ? <>
        <section><h2>1. احسب الدخل المتاح</h2><p>ابدأ بالمبلغ المتوقع دخوله خلال الشهر بعد أي خصومات ثابتة تعرفها. لو دخلك متغير، استخدم تقديرًا محافظًا مبنيًا على الأشهر السابقة، وسيب مساحة لأي تغير.</p></section>
        <section><h2>2. اكتب الالتزامات الأساسية</h2><p>سجل المصروفات الضرورية زي السكن والفواتير والمواصلات والاحتياجات الأساسية. فرّق بين الفواتير الثابتة والمصاريف اللي ممكن تتغير.</p></section>
        <section><h2>3. خطط للمصاريف المرنة</h2><p>حدد حدودًا تقريبية للأكل خارج البيت والتسوق والترفيه والاشتراكات. استخدم أرقامًا تناسب ظروفك الفعلية، مش قاعدة واحدة تنطبق على كل الناس.</p></section>
        <section><h2>4. حدد مبلغًا للادخار والمصاريف غير المتوقعة</h2><p>لو تقدر، خصص مبلغًا للادخار واحتياطيًا للطوارئ. حتى المبلغ الصغير المنتظم ممكن يساعدك تبني عادة؛ وعدّل الخطة لو دخلك أو التزاماتك اتغيرت.</p></section>
        <section><h2>5. راجع الميزانية أسبوعيًا</h2><p>خد عشر دقايق كل أسبوع لمقارنة اللي صرفته بالخطة. لو بند زاد، شوف السبب وعدّل باقي الشهر بدل ما تعتبر الميزانية فشلت.</p></section>
        <section><h2>مثال بسيط</h2><p>لو دخلك الشهري 10,000 جنيه، ممكن تبدأ بتقسيم مبدئي مثل 6,000 للاحتياجات، و2,500 للمصاريف المرنة، و1,000 للادخار، و500 للاحتياطي. المثال للتوضيح فقط؛ النسب المناسبة تختلف حسب السكن والديون والدخل والظروف.</p></section>
        <p className="public-content-note">المقال للتثقيف العام فقط، ولا يقدم نصيحة مالية أو ضريبية أو استثمارية.</p>
      </> : <>
        <section><h2>1. Work out the income you can plan with</h2><p>Start with the money you realistically expect to receive during the month, after any deductions you already know about. If your income changes, use a cautious estimate based on recent months and leave room for variation.</p></section>
        <section><h2>2. List essential commitments</h2><p>Write down necessary costs such as housing, utilities, transport and basic needs. Separate fixed bills from expenses that may vary from month to month.</p></section>
        <section><h2>3. Give flexible spending a limit</h2><p>Set reasonable amounts for eating out, shopping, entertainment and subscriptions. Choose figures that fit your actual circumstances rather than following a universal percentage.</p></section>
        <section><h2>4. Plan for saving and unexpected costs</h2><p>When possible, set aside an amount for savings and a buffer for unexpected expenses. A small, repeatable amount can help build a habit. Adjust the plan when your income or commitments change.</p></section>
        <section><h2>5. Review the plan each week</h2><p>Spend ten minutes comparing your actual spending with the plan. If a category is higher than expected, look for the reason and adjust the remaining weeks instead of treating the whole budget as a failure.</p></section>
        <section><h2>A simple example</h2><p>With monthly income of EGP 10,000, an illustrative starting plan could allocate EGP 6,000 to essentials, EGP 2,500 to flexible spending, EGP 1,000 to savings and EGP 500 to a buffer. This is only an example: a suitable budget depends on housing, debt, income and personal circumstances.</p></section>
        <p className="public-content-note">This article is general education, not financial, tax or investment advice.</p>
      </>}
    </PublicPageLayout>
  );
}
