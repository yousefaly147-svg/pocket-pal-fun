import { createFileRoute } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/guides')({
  head: () => ({
    meta: [
      { title: 'Budgeting & Expense Tracking Guides | Pocketjr' },
      { name: 'description', content: 'Practical personal finance guides: make a monthly budget in EGP, track everyday expenses, categorize spending and build realistic savings goals.' },
      { property: 'og:title', content: 'Budgeting & Expense Tracking Guides | Pocketjr Finance' },
      { property: 'og:description', content: 'Practical guides to budgeting in Egypt, tracking expenses and setting realistic savings goals.' },
      { property: 'og:site_name', content: 'Pocketjr Finance' },
      { name: 'twitter:title', content: 'Budgeting & Expense Tracking Guides | Pocketjr Finance' },
      { name: 'twitter:description', content: 'Practical guides to budgeting in Egypt, tracking expenses and setting realistic savings goals.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/guides' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/guides' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/guides' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/guides' },
    ],
  }),
  component: GuidesPage,
});

export function GuidesPage() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  return (
    <PublicPageLayout
      title={ar ? 'دليل المال الشخصي' : 'Personal finance guides'}
      description={ar ? 'مقالات تعليمية بسيطة تساعدك تنظم الميزانية وتفهم الصرف وتخطط للادخار.' : 'Practical, beginner-friendly articles to help you plan a budget, understand spending and work toward savings goals.'}
    >
      <nav className="public-guide-grid" aria-label={ar ? 'موضوعات الدليل' : 'Guide topics'}>
        <a className="public-guide-card" href="#monthly-budget">
          <span>{ar ? 'الدليل الأول' : 'Guide 1'}</span>
          <h2>{ar ? 'ميزانية شهرية بسيطة' : 'A simple monthly budget'}</h2>
          <p>{ar ? 'خطوات عملية لتخطيط الدخل والمصروفات.' : 'Plan income and expenses with a few repeatable steps.'}</p>
        </a>
        <a className="public-guide-card" href="#expense-tracking">
          <span>{ar ? 'الدليل الثاني' : 'Guide 2'}</span>
          <h2>{ar ? 'متابعة وتقسيم المصروفات' : 'Track and categorize expenses'}</h2>
          <p>{ar ? 'اكتشف أنماط الصرف وراجع العمليات المتكررة.' : 'Spot spending patterns and review recurring costs.'}</p>
        </a>
        <a className="public-guide-card" href="#savings-goals">
          <span>{ar ? 'الدليل الثالث' : 'Guide 3'}</span>
          <h2>{ar ? 'تحديد هدف ادخار واقعي' : 'Set a realistic savings goal'}</h2>
          <p>{ar ? 'حوّل الهدف الكبير لخطوات شهرية.' : 'Turn a larger goal into manageable monthly steps.'}</p>
        </a>
      </nav>

      {ar ? <>
        <article id="monthly-budget" className="public-guide-article">
          <h2>إزاي تعمل ميزانية شهرية بسيطة</h2>
          <p>الميزانية مش لازم تكون معقدة. الفكرة إنك تعرف دخلك رايح فين وتخطط قبل ما الشهر يبدأ.</p>
          <h3>1. احسب الدخل المتاح</h3>
          <p>ابدأ بالمبلغ المتوقع دخوله خلال الشهر بعد أي خصومات ثابتة تعرفها. لو دخلك متغير، استخدم تقديرًا محافظًا مبنيًا على الأشهر السابقة، وسيب مساحة لأي تغير.</p>
          <h3>2. اكتب الالتزامات الأساسية</h3>
          <p>سجل المصروفات الضرورية زي السكن والفواتير والمواصلات والاحتياجات الأساسية. فرّق بين الفواتير الثابتة والمصاريف اللي ممكن تتغير.</p>
          <h3>3. خطط للمصاريف المرنة</h3>
          <p>حدد حدودًا تقريبية للأكل خارج البيت والتسوق والترفيه والاشتراكات. استخدم أرقامًا تناسب ظروفك الفعلية، مش قاعدة واحدة تنطبق على كل الناس.</p>
          <h3>4. حدد مبلغًا للادخار والطوارئ</h3>
          <p>لو تقدر، خصص مبلغًا للادخار واحتياطيًا للطوارئ. حتى المبلغ الصغير المنتظم ممكن يساعدك تبني عادة؛ وعدّل الخطة لو دخلك أو التزاماتك اتغيرت.</p>
          <h3>5. راجع الميزانية أسبوعيًا</h3>
          <p>خد عشر دقايق كل أسبوع لمقارنة اللي صرفته بالخطة. لو بند زاد، شوف السبب وعدّل باقي الشهر بدل ما تعتبر الميزانية فشلت.</p>
          <h3>مثال بسيط</h3>
          <p>لو دخلك الشهري 10,000 جنيه، ممكن تبدأ بتقسيم مبدئي مثل 6,000 للاحتياجات، و2,500 للمصاريف المرنة، و1,000 للادخار، و500 للاحتياطي. المثال للتوضيح فقط؛ النسب المناسبة تختلف حسب السكن والديون والدخل والظروف.</p>
        </article>
        <article id="expense-tracking" className="public-guide-article">
          <h2>إزاي تتابع وتقسم مصروفاتك</h2>
          <p>تسجيل الصرف بانتظام بيساعدك تشوف الصورة كاملة بدل الاعتماد على الذاكرة.</p>
          <h3>اختار طريقة تسجيل واحدة</h3>
          <p>سجل كل عملية في أقرب وقت ممكن، واكتب المبلغ والتاريخ ووصفًا مختصرًا. اختار نفس طريقة التسجيل كل مرة عشان المقارنة تبقى أسهل.</p>
          <h3>استخدم فئات واضحة</h3>
          <p>ابدأ بفئات بسيطة زي الأكل، المواصلات، السكن والفواتير، التسوق، والترفيه. لو فئة واحدة بقت كبيرة جدًا، اقسمها لفئات أصغر مفيدة بدل ما تعمل قوائم طويلة من البداية.</p>
          <h3>فرّق بين الضروري والاختياري</h3>
          <p>التصنيف مش للحكم على اختياراتك. هو وسيلة تعرف بيها المصروفات الثابتة والمرنة، وتحدد إيه اللي ممكن يتغير لو احتجت.</p>
          <h3>راجع العمليات المتكررة</h3>
          <p>ابحث عن الاشتراكات والفواتير والمشتريات الصغيرة المتكررة. اسأل نفسك هل ما زلت محتاجها وهل قيمتها مناسبة لاستخدامك.</p>
          <h3>اعمل مراجعة أسبوعية قصيرة</h3>
          <p>قارن إجمالي كل فئة بالأسبوع اللي قبله أو بالخطة الشهرية. لاحظ الأنماط بدل التركيز على عملية منفردة، وصحح أي تسجيل ناقص أو مكرر.</p>
          <p className="public-content-note">حافظ على خصوصيتك: لا تسجل أرقام البطاقات أو كلمات المرور أو رموز الأمان في وصف المعاملة.</p>
        </article>
        <article id="savings-goals" className="public-guide-article">
          <h2>إزاي تحدد هدف ادخار واقعي</h2>
          <p>الهدف الواضح بخطة مرنة أسهل في المتابعة من رقم كبير من غير خطوات.</p>
          <h3>1. حدد الهدف والمبلغ</h3>
          <p>اكتب أنت بتدخر ليه، وقد إيه المبلغ التقريبي المطلوب. لو التكلفة غير مؤكدة، استخدم تقديرًا مبدئيًا وراجع الرقم لما تتوفر معلومات أدق.</p>
          <h3>2. اختار وقتًا مناسبًا</h3>
          <p>حدد موعدًا مستهدفًا بناءً على ظروفك، مش على ضغط خارجي. لو الموعد قريب جدًا مقارنة بدخلك والتزاماتك، مدّه بدل ما تضغط على احتياجاتك الأساسية.</p>
          <h3>3. قسم المبلغ لخطوات</h3>
          <p>اطرح أي مبلغ ادخرته بالفعل من الهدف، ثم اقسم الباقي على عدد الأشهر المتاحة. الناتج يديك تقديرًا للمبلغ الشهري المطلوب، ويمكنك تغييره حسب دخلك.</p>
          <h3>4. افصل الادخار عن مصروفاتك اليومية</h3>
          <p>لو أمكن، خصص مكانًا واضحًا أو حسابًا منفصلًا للادخار. تجنب استثمار أموال تحتاجها قريبًا في أدوات لا تفهم مخاطرها أو يصعب سحبها.</p>
          <h3>5. راجع الهدف وعدّله</h3>
          <p>راجع تقدمك كل شهر. لو حصل ظرف أو تغير الدخل، قلل المبلغ أو عدّل الموعد. الاستمرار بخطة واقعية أفضل من خطة قاسية يصعب الحفاظ عليها.</p>
        </article>
        <p className="public-content-note">المحتوى للتثقيف العام فقط، وليس نصيحة مالية أو ضريبية أو استثمارية ولا يوصي بمنتج محدد.</p>
      </> : <>
        <article id="monthly-budget" className="public-guide-article">
          <h2>How to make a simple monthly budget</h2>
          <p>A budget does not need to be complicated. The aim is to understand where your money goes and make a plan before the month begins.</p>
          <h3>1. Work out the income you can plan with</h3>
          <p>Start with the money you realistically expect to receive during the month, after any deductions you already know about. If your income changes, use a cautious estimate based on recent months and leave room for variation.</p>
          <h3>2. List essential commitments</h3>
          <p>Write down necessary costs such as housing, utilities, transport and basic needs. Separate fixed bills from expenses that may vary from month to month.</p>
          <h3>3. Give flexible spending a limit</h3>
          <p>Set reasonable amounts for eating out, shopping, entertainment and subscriptions. Choose figures that fit your actual circumstances rather than following a universal percentage.</p>
          <h3>4. Plan for saving and unexpected costs</h3>
          <p>When possible, set aside an amount for savings and a buffer for unexpected expenses. A small, repeatable amount can help build a habit. Adjust the plan when your income or commitments change.</p>
          <h3>5. Review the plan each week</h3>
          <p>Spend ten minutes comparing your actual spending with the plan. If a category is higher than expected, look for the reason and adjust the remaining weeks instead of treating the whole budget as a failure.</p>
          <h3>A simple example</h3>
          <p>With monthly income of EGP 10,000, an illustrative starting plan could allocate EGP 6,000 to essentials, EGP 2,500 to flexible spending, EGP 1,000 to savings and EGP 500 to a buffer. This is only an example: a suitable budget depends on housing, debt, income and personal circumstances.</p>
        </article>
        <article id="expense-tracking" className="public-guide-article">
          <h2>How to track and categorize expenses</h2>
          <p>Recording spending consistently helps you see the full picture instead of relying on memory.</p>
          <h3>Choose one consistent recording habit</h3>
          <p>Record each purchase as soon as practical, including the amount, date and a short description. Using the same method each time makes your records easier to compare.</p>
          <h3>Use clear categories</h3>
          <p>Start with a few useful groups such as food, transport, housing and bills, shopping and entertainment. If one category becomes too broad, split it into smaller groups only when that helps you make decisions.</p>
          <h3>Separate essential and optional costs</h3>
          <p>Categories are not a way to judge your choices. They help you see which costs are fixed and which are flexible, so you can identify what might change when needed.</p>
          <h3>Look for recurring payments</h3>
          <p>Review subscriptions, bills and small repeat purchases. Ask whether you still use each service and whether its cost makes sense for you.</p>
          <h3>Do a short weekly review</h3>
          <p>Compare each category with the previous week or with your monthly plan. Look for patterns rather than focusing on one purchase, and correct any missing or duplicate entries.</p>
          <p className="public-content-note">Protect your privacy: never put card numbers, passwords or security codes in transaction descriptions.</p>
        </article>
        <article id="savings-goals" className="public-guide-article">
          <h2>How to set a realistic savings goal</h2>
          <p>A clear goal with a flexible plan is easier to follow than a large number without practical steps.</p>
          <h3>1. Name the goal and estimate its cost</h3>
          <p>Write down what you are saving for and the approximate amount you need. If the cost is uncertain, begin with an estimate and update it when you have better information.</p>
          <h3>2. Choose a workable timeline</h3>
          <p>Pick a target date that fits your circumstances, not outside pressure. If the deadline would force you to neglect essential costs, extend it.</p>
          <h3>3. Break the amount into steps</h3>
          <p>Subtract anything you have already saved from the target, then divide the remainder by the number of months available. This gives you an estimated monthly contribution that you can adjust to your income.</p>
          <h3>4. Keep the goal distinct from everyday spending</h3>
          <p>Where practical, use a clearly identified place or separate account for the money. Avoid putting money you need soon into products whose risks you do not understand or that may be difficult to access.</p>
          <h3>5. Review and adjust the plan</h3>
          <p>Check your progress each month. If circumstances or income change, reduce the contribution or move the target date. A realistic plan you can maintain is more useful than an overly strict one.</p>
        </article>
        <p className="public-content-note">These guides are for general education only. They are not financial, tax or investment advice and do not recommend a specific product.</p>
      </>}
    </PublicPageLayout>
  );
}
