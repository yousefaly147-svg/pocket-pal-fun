import { createFileRoute } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/guides/expense-tracking')({
  head: () => ({
    meta: [
      { title: 'How to Track and Categorize Expenses | Pocketjr' },
      { name: 'description', content: 'Learn how to record purchases consistently, group expenses and review spending patterns.' },
    ],
  }),
  component: ExpenseTrackingGuide,
});

function ExpenseTrackingGuide() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  return (
    <PublicPageLayout
      title={ar ? 'إزاي تتابع وتقسم مصروفاتك' : 'How to track and categorize expenses'}
      description={ar ? 'تسجيل الصرف بانتظام بيساعدك تشوف الصورة كاملة بدل الاعتماد على الذاكرة.' : 'Recording spending consistently helps you see the full picture instead of relying on memory.'}
    >
      {ar ? <>
        <section><h2>ابدأ بطريقة تسجيل واحدة</h2><p>سجل كل عملية في أقرب وقت ممكن، واكتب المبلغ والتاريخ ووصفًا مختصرًا. اختار نفس طريقة التسجيل كل مرة عشان المقارنة تبقى أسهل.</p></section>
        <section><h2>استخدم فئات واضحة</h2><p>ابدأ بفئات بسيطة زي الأكل، المواصلات، السكن والفواتير، التسوق، والترفيه. لو فئة واحدة بقت كبيرة جدًا، اقسمها لفئات أصغر مفيدة بدل ما تعمل قوائم طويلة من البداية.</p></section>
        <section><h2>فرّق بين الضروري والاختياري</h2><p>التصنيف مش للحكم على اختياراتك. هو وسيلة تعرف بيها المصروفات الثابتة والمرنة، وتحدد إيه اللي ممكن يتغير لو احتجت.</p></section>
        <section><h2>راجع العمليات المتكررة</h2><p>ابحث عن الاشتراكات والفواتير والمشتريات الصغيرة المتكررة. اسأل نفسك هل ما زلت محتاجها وهل قيمتها مناسبة لاستخدامك.</p></section>
        <section><h2>اعمل مراجعة أسبوعية قصيرة</h2><p>قارن إجمالي كل فئة بالأسبوع اللي قبله أو بالخطة الشهرية. لاحظ الأنماط بدل التركيز على عملية منفردة، وصحح أي تسجيل ناقص أو مكرر.</p></section>
        <p className="public-content-note">حافظ على خصوصيتك: لا تسجل أرقام البطاقات أو كلمات المرور أو رموز الأمان في وصف المعاملة.</p>
      </> : <>
        <section><h2>Choose one consistent recording habit</h2><p>Record each purchase as soon as practical, including the amount, date and a short description. Using the same method each time makes your records easier to compare.</p></section>
        <section><h2>Use clear categories</h2><p>Start with a few useful groups such as food, transport, housing and bills, shopping and entertainment. If one category becomes too broad, split it into smaller groups only when that helps you make decisions.</p></section>
        <section><h2>Separate essential and optional costs</h2><p>Categories are not a way to judge your choices. They help you see which costs are fixed and which are flexible, so you can identify what might change when needed.</p></section>
        <section><h2>Look for recurring payments</h2><p>Review subscriptions, bills and small repeat purchases. Ask whether you still use each service and whether its cost makes sense for you.</p></section>
        <section><h2>Do a short weekly review</h2><p>Compare each category with the previous week or with your monthly plan. Look for patterns rather than focusing on one purchase, and correct any missing or duplicate entries.</p></section>
        <p className="public-content-note">Protect your privacy: never put card numbers, passwords or security codes in transaction descriptions.</p>
      </>}
    </PublicPageLayout>
  );
}
