import { createFileRoute } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/guides/savings-goals')({
  head: () => ({
    meta: [
      { title: 'How to Set a Realistic Savings Goal | Pocketjr' },
      { name: 'description', content: 'Turn a savings goal into a clear amount, timeline and manageable regular contribution.' },
    ],
  }),
  component: SavingsGoalsGuide,
});

function SavingsGoalsGuide() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  return (
    <PublicPageLayout
      title={ar ? 'إزاي تحدد هدف ادخار واقعي' : 'How to set a realistic savings goal'}
      description={ar ? 'الهدف الواضح بخطة مرنة أسهل في المتابعة من رقم كبير من غير خطوات.' : 'A clear goal with a flexible plan is easier to follow than a large number without practical steps.'}
    >
      {ar ? <>
        <section><h2>1. حدد الهدف والمبلغ</h2><p>اكتب أنت بتدخر ليه، وقد إيه المبلغ التقريبي المطلوب. لو التكلفة غير مؤكدة، استخدم تقديرًا مبدئيًا وراجع الرقم لما تتوفر معلومات أدق.</p></section>
        <section><h2>2. اختار وقتًا مناسبًا</h2><p>حدد موعدًا مستهدفًا بناءً على ظروفك، مش على ضغط خارجي. لو الموعد قريب جدًا مقارنة بدخلك والتزاماتك، مدّه بدل ما تضغط على احتياجاتك الأساسية.</p></section>
        <section><h2>3. قسم المبلغ لخطوات</h2><p>اطرح أي مبلغ ادخرته بالفعل من الهدف، ثم اقسم الباقي على عدد الأشهر المتاحة. الناتج يديك تقديرًا للمبلغ الشهري المطلوب، ويمكنك تغييره حسب دخلك.</p></section>
        <section><h2>4. افصل الادخار عن مصروفاتك اليومية</h2><p>لو أمكن، خصص مكانًا واضحًا أو حسابًا منفصلًا للادخار. تجنب استثمار أموال تحتاجها قريبًا في أدوات لا تفهم مخاطرها أو يصعب سحبها.</p></section>
        <section><h2>5. راجع الهدف وعدّله</h2><p>راجع تقدمك كل شهر. لو حصل ظرف أو تغير الدخل، قلل المبلغ أو عدّل الموعد. الاستمرار بخطة واقعية أفضل من خطة قاسية يصعب الحفاظ عليها.</p></section>
        <p className="public-content-note">المقال تعليمي عام ولا يوصي بمنتج ادخاري أو استثماري معين.</p>
      </> : <>
        <section><h2>1. Name the goal and estimate its cost</h2><p>Write down what you are saving for and the approximate amount you need. If the cost is uncertain, begin with an estimate and update it when you have better information.</p></section>
        <section><h2>2. Choose a workable timeline</h2><p>Pick a target date that fits your circumstances, not outside pressure. If the deadline would force you to neglect essential costs, extend it.</p></section>
        <section><h2>3. Break the amount into steps</h2><p>Subtract anything you have already saved from the target, then divide the remainder by the number of months available. This gives you an estimated monthly contribution that you can adjust to your income.</p></section>
        <section><h2>4. Keep the goal distinct from everyday spending</h2><p>Where practical, use a clearly identified place or separate account for the money. Avoid putting money you need soon into products whose risks you do not understand or that may be difficult to access.</p></section>
        <section><h2>5. Review and adjust the plan</h2><p>Check your progress each month. If circumstances or income change, reduce the contribution or move the target date. A realistic plan you can maintain is more useful than an overly strict one.</p></section>
        <p className="public-content-note">This is general education and does not recommend any particular savings or investment product.</p>
      </>}
    </PublicPageLayout>
  );
}
