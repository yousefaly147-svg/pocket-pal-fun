import { Link } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';

export type GuideSlug = 'monthly-budget' | 'expense-tracking' | 'savings-goals';

type Section = { heading: string; paragraphs: string[]; bullets?: string[] };

const guides: Record<GuideSlug, {
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  intro: { en: string; ar: string };
  sections: { en: Section[]; ar: Section[] };
  takeaway: { en: string; ar: string };
}> = {
  'monthly-budget': {
    title: {
      en: 'How to Make a Monthly Budget in Egypt',
      ar: 'إزاي تعمل ميزانية شهرية في مصر',
    },
    description: {
      en: 'A practical beginner guide to planning monthly income and expenses in Egyptian pounds, setting spending limits and reviewing your budget.',
      ar: 'دليل عملي للمبتدئين لتنظيم الدخل والمصروفات بالجنيه المصري وتحديد حدود للصرف ومراجعة الميزانية كل شهر.',
    },
    intro: {
      en: 'A monthly budget is a simple plan for the money you expect to receive and the costs you need to cover. It is not a strict rulebook. A useful budget reflects your real circumstances, helps you prepare for upcoming bills and gives you a clearer view of what is left.',
      ar: 'الميزانية الشهرية هي خطة بسيطة للدخل المتوقع والمصاريف اللي لازم تغطيها. مش مجموعة قواعد ثابتة؛ الميزانية المفيدة بتناسب ظروفك وبتساعدك تستعد للفواتير وتعرف المتبقي من فلوسك.',
    },
    sections: {
      en: [
        { heading: '1. Start with realistic monthly income', paragraphs: [
          'Write down the income you can reasonably expect during the month. If you have a fixed salary, use the amount that actually reaches you after known deductions. If your income changes, use a cautious estimate rather than your best month. Keep occasional gifts, bonuses or uncertain payments separate until they arrive.'
        ]},
        { heading: '2. List essential and fixed expenses first', paragraphs: [
          'Add the costs that must be paid, such as rent, utilities, phone or internet bills, transport to work or school, debt payments and regular family commitments. Mark which amounts are fixed and which can change. This gives you a realistic minimum cost for the month.'
        ]},
        { heading: '3. Plan flexible spending by category', paragraphs: [
          'Create a small number of categories that match your life: groceries, meals outside the home, transport, personal purchases, entertainment and subscriptions are common examples. Give each category a limit you can actually follow. You can adjust the limits after observing your spending for a few weeks.'
        ]},
        { heading: '4. Include savings and a small buffer', paragraphs: [
          'When your essential costs are covered, decide whether you can set aside a regular amount for a goal or unexpected expense. Start with an amount that does not force you to skip necessities or borrow to get through the month. If you have high-cost debt or irregular income, your priorities may be different.'
        ]},
        { heading: '5. Review your budget every week', paragraphs: [
          'Choose one day each week to compare the plan with what you actually spent. Look for categories that are moving faster than expected, check for forgotten subscriptions and adjust the rest of the month. A budget is a living plan: changing it when circumstances change is sensible, not failure.'
        ]},
        { heading: 'A simple EGP example', paragraphs: [
          'Imagine a person expects to receive EGP 10,000 in a month. They might first list rent and bills, then estimate food and transport, then decide whether anything is available for savings. The right amounts depend on household size, housing, debt, location and personal commitments; there is no single percentage split that works for everyone.'
        ]}
      ],
      ar: [
        { heading: '١. ابدأ بحساب الدخل المتوقع', paragraphs: [
          'اكتب المبلغ اللي متوقع يدخل لك خلال الشهر. لو عندك مرتب ثابت، استخدم المبلغ اللي بتستلمه فعليًا بعد الخصومات المعروفة. لو دخلك متغير، اختار تقديرًا محافظًا بدل ما تعتمد على أفضل شهر عدى عليك. افصل المكافآت أو المبالغ غير المؤكدة لحد ما تستلمها.'
        ]},
        { heading: '٢. اكتب المصاريف الأساسية والثابتة', paragraphs: [
          'سجل الالتزامات اللي لازم تتدفع زي الإيجار والفواتير والموبايل والإنترنت والمواصلات وأقساط الديون والالتزامات العائلية. وضح إيه ثابت وإيه ممكن يتغير. كده هتعرف الحد الأدنى اللي محتاجه كل شهر.'
        ]},
        { heading: '٣. قسم الصرف المرن لفئات واضحة', paragraphs: [
          'اعمل فئات قليلة تناسب حياتك: أكل البيت، الأكل بره، المواصلات، المشتريات الشخصية، الترفيه والاشتراكات. حدد لكل فئة مبلغ تقدر تلتزم بيه فعلًا، وعدل الحدود بعد ما تتابع صرفك كام أسبوع.'
        ]},
        { heading: '٤. خصص مبلغًا للادخار واحتياطيًا للطوارئ', paragraphs: [
          'بعد تغطية الاحتياجات الأساسية، شوف هل تقدر تخصص مبلغًا منتظمًا لهدف ادخار أو لمصاريف غير متوقعة. ابدأ بمبلغ ما يضطركش تستغنى عن الضروريات أو تستلف عشان تكمل الشهر. لو عندك ديون مكلفة أو دخل غير منتظم، ممكن تكون أولوياتك مختلفة.'
        ]},
        { heading: '٥. راجع الميزانية كل أسبوع', paragraphs: [
          'اختار يومًا كل أسبوع تقارن فيه الخطة بالصرف الفعلي. لاحظ الفئات اللي بتخلص أسرع من المتوقع، وراجع الاشتراكات أو المصاريف اللي نسيتها، وعدل باقي الشهر. الميزانية خطة قابلة للتغيير؛ تعديلها مع ظروفك مش معناه إنك فشلت.'
        ]},
        { heading: 'مثال بسيط بالجنيه المصري', paragraphs: [
          'تخيل إن شخص متوقع يستلم ١٠,٠٠٠ جنيه خلال الشهر. يبدأ بكتابة الإيجار والفواتير، وبعدها يقدر الأكل والمواصلات، ثم يشوف هل فيه مبلغ متاح للادخار. المبالغ المناسبة بتختلف حسب عدد أفراد الأسرة والسكن والديون والمكان والالتزامات؛ مفيش تقسيمة واحدة تناسب كل الناس.'
        ]}
      ]
    },
    takeaway: {
      en: 'The best budget is one you can understand and keep updating. Start with the numbers you know, record the rest and review your plan regularly.',
      ar: 'أفضل ميزانية هي اللي تقدر تفهمها وتراجعها باستمرار. ابدأ بالأرقام اللي تعرفها، وسجل الصرف، وراجع خطتك بانتظام.'
    }
  },
  'expense-tracking': {
    title: {
      en: 'How to Track and Categorize Your Expenses',
      ar: 'إزاي تتابع وتقسم مصروفاتك',
    },
    description: {
      en: 'Learn a simple daily expense tracking method, choose useful spending categories and find recurring costs without complicated spreadsheets.',
      ar: 'اتعلم طريقة بسيطة لتسجيل الصرف اليومي وتقسيم المصروفات واكتشاف التكاليف المتكررة من غير جداول معقدة.',
    },
    intro: {
      en: 'Expense tracking means keeping a reliable record of where your money goes. The goal is not to judge every purchase. It is to replace guesswork with a clear picture, so you can decide what to keep, change or plan for next month.',
      ar: 'متابعة المصروفات معناها إنك تسجل فلوسك بتروح فين بشكل منتظم. الهدف مش إنك تحكم على كل عملية شراء، لكن إنك تستبدل التخمين بصورة واضحة تساعدك تقرر إيه يستمر وإيه يتغير الشهر الجاي.',
    },
    sections: {
      en: [
        { heading: '1. Record purchases while they are fresh', paragraphs: [
          'Enter an expense as soon as practical, or set one short time each evening to record the day. Include the amount, date, category and a brief description. Waiting until the end of the month makes small cash purchases easier to forget.'
        ]},
        { heading: '2. Use a few categories that make sense', paragraphs: [
          'Start with broad groups such as housing and bills, groceries, transport, health, education, shopping and leisure. Add a new category only when it answers a useful question. Too many categories can make tracking harder without giving you better decisions.'
        ]},
        { heading: '3. Separate needs, commitments and optional spending', paragraphs: [
          'You can label fixed commitments, everyday needs and flexible purchases separately. This is not a moral judgement. It helps you understand which expenses are difficult to change and which might be adjusted when your budget is tight.'
        ]},
        { heading: '4. Look for recurring and forgotten costs', paragraphs: [
          'Review subscriptions, automatic renewals, delivery fees and small purchases that happen frequently. Add up their monthly cost and ask whether each service is still useful. Check bank or wallet statements where available, but never share passwords, one-time codes or full card details with a tracking tool.'
        ]},
        { heading: '5. Review patterns instead of one purchase', paragraphs: [
          'At the end of each week, compare category totals and notice what changed. A single unusual expense may not represent a habit. Several weeks of records can reveal patterns such as frequent takeaway meals, transport costs or overlapping subscriptions.'
        ]},
        { heading: '6. Keep the habit easy to maintain', paragraphs: [
          'Use one method consistently: a notebook, spreadsheet or finance tracker. Correct mistakes when you find them and avoid recording sensitive information such as card numbers, passwords, PINs or security codes in transaction notes.'
        ]}
      ],
      ar: [
        { heading: '١. سجل العملية أول ما تقدر', paragraphs: [
          'سجل المصروف بعد ما يحصل بوقت قريب، أو خصص وقتًا قصيرًا كل يوم لتسجيل صرف اليوم. اكتب المبلغ والتاريخ والفئة ووصفًا بسيطًا. التأجيل لآخر الشهر بيخلي المشتريات النقدية الصغيرة سهلة النسيان.'
        ]},
        { heading: '٢. استخدم فئات قليلة ومفهومة', paragraphs: [
          'ابدأ بفئات عامة زي السكن والفواتير، الأكل، المواصلات، الصحة، التعليم، التسوق والترفيه. أضف فئة جديدة بس لما تساعدك تجاوب على سؤال مهم. كثرة الفئات ممكن تصعب التسجيل من غير ما تحسن قراراتك.'
        ]},
        { heading: '٣. فرق بين الالتزامات والاحتياجات والصرف الاختياري', paragraphs: [
          'ممكن تصنف الالتزامات الثابتة والاحتياجات اليومية والمشتريات المرنة بشكل منفصل. ده مش حكم على اختياراتك؛ ده بيساعدك تعرف المصاريف اللي صعب تتغير والمصاريف اللي ممكن تعدلها لو الميزانية ضاقت.'
        ]},
        { heading: '٤. دور على التكاليف المتكررة والمنسية', paragraphs: [
          'راجع الاشتراكات والتجديد التلقائي ورسوم التوصيل والمشتريات الصغيرة المتكررة. احسب تكلفتها الشهرية واسأل نفسك هل كل خدمة لسه مفيدة. ممكن تراجع كشف الحساب أو المحفظة، لكن ما تشاركش كلمات المرور أو أكواد الاستخدام مرة واحدة أو بيانات البطاقة الكاملة مع أي أداة.'
        ]},
        { heading: '٥. راجع الأنماط مش عملية واحدة', paragraphs: [
          'في نهاية كل أسبوع، قارن إجمالي الفئات ولاحظ إيه اللي اتغير. عملية غير معتادة مش بالضرورة تعبر عن عادة. التسجيل لعدة أسابيع ممكن يكشف أنماط زي طلب الأكل المتكرر أو تكلفة المواصلات أو الاشتراكات المتداخلة.'
        ]},
        { heading: '٦. خلي العادة سهلة الاستمرار', paragraphs: [
          'استخدم طريقة واحدة باستمرار: كشكول أو جدول أو تطبيق لمتابعة المال. صحح الأخطاء لما تلاحظها، ومتكتبش معلومات حساسة زي أرقام البطاقات أو كلمات المرور أو الرقم السري أو أكواد الأمان في وصف المعاملة.'
        ]}
      ]
    },
    takeaway: {
      en: 'Consistency matters more than a perfect category system. A simple record you maintain every day is more useful than a detailed spreadsheet you stop using.',
      ar: 'الاستمرار أهم من نظام تصنيف مثالي. تسجيل بسيط تقدر تلتزم بيه كل يوم أنفع من جدول معقد تبطل تستخدمه.'
    }
  },
  'savings-goals': {
    title: {
      en: 'How to Set a Realistic Savings Goal',
      ar: 'إزاي تحدد هدف ادخار واقعي',
    },
    description: {
      en: 'Turn a savings wish into a practical plan: estimate the cost, choose a timeline, calculate monthly contributions and review progress.',
      ar: 'حوّل رغبتك في الادخار لخطة عملية: قدر التكلفة، اختار المدة، احسب المبلغ الشهري وراجع تقدمك.',
    },
    intro: {
      en: 'A savings goal gives a purpose to the money you set aside. It might be for education, a device, travel, an emergency reserve or another priority. A realistic goal has a clear amount, a flexible date and a contribution that fits your income and essential costs.',
      ar: 'هدف الادخار بيدي معنى للمبلغ اللي بتوفره. ممكن يكون للتعليم أو جهاز أو سفر أو احتياطي للطوارئ أو أي أولوية تانية. الهدف الواقعي ليه مبلغ واضح وموعد مرن ومساهمة مناسبة لدخلك ومصاريفك الأساسية.',
    },
    sections: {
      en: [
        { heading: '1. Give the goal a name and an estimated cost', paragraphs: [
          'Write down exactly what you are saving for. Research the likely cost and include any related expenses, such as delivery, accessories or fees. If the price may change, treat your first figure as an estimate and review it later.'
        ]},
        { heading: '2. Choose a timeline that protects essentials', paragraphs: [
          'Set a target date that makes sense for your circumstances. Do not choose a deadline that forces you to miss rent, bills, food, debt payments or other essential commitments. Extending the timeline is often better than creating financial pressure.'
        ]},
        { heading: '3. Calculate a monthly starting amount', paragraphs: [
          'Subtract the amount you have already saved from the target. Divide what remains by the number of months until your target date. The result is a starting estimate, not an obligation. If it is too high, lower the monthly amount or move the date.'
        ]},
        { heading: '4. Keep savings visible and separate', paragraphs: [
          'Where possible, keep the goal in a clearly labelled place or separate account so it is not confused with everyday spending. Make sure you can access money when you need it. Do not put short-term savings into products whose risks, fees or withdrawal rules you do not understand.'
        ]},
        { heading: '5. Prepare for setbacks', paragraphs: [
          'Some months will be more expensive than others. Decide in advance how you will respond: reduce the contribution temporarily, pause it for an emergency or move the target date. Avoid borrowing just to keep an arbitrary savings schedule.'
        ]},
        { heading: '6. Celebrate progress and update the plan', paragraphs: [
          'Check the balance once a month and note how much closer you are to the target. Update the expected cost if prices change, and adjust contributions when your income changes. A plan that adapts is more likely to last.'
        ]}
      ],
      ar: [
        { heading: '١. سمي الهدف وقدر تكلفته', paragraphs: [
          'اكتب أنت بتدخر عشان إيه بالتحديد. ابحث عن التكلفة المتوقعة وضيف أي مصاريف مرتبطة زي التوصيل أو الإكسسوارات أو الرسوم. لو السعر ممكن يتغير، اعتبر الرقم الأول تقديرًا وراجعه بعدين.'
        ]},
        { heading: '٢. اختار مدة تحافظ على احتياجاتك الأساسية', paragraphs: [
          'حدد موعدًا مناسبًا لظروفك. ما تختارش موعد يضطرك تتأخر في الإيجار أو الفواتير أو الأكل أو أقساط الديون أو أي التزام أساسي. تمديد المدة غالبًا أفضل من الضغط المالي.'
        ]},
        { heading: '٣. احسب مبلغًا شهريًا مبدئيًا', paragraphs: [
          'اطرح المبلغ اللي وفرته بالفعل من الهدف، واقسم الباقي على عدد الشهور لحد الموعد المستهدف. الناتج تقدير مبدئي مش التزام إجباري. لو المبلغ كبير عليك، قلل المساهمة الشهرية أو مد المدة.'
        ]},
        { heading: '٤. خلي الادخار واضح ومنفصل', paragraphs: [
          'لو تقدر، احتفظ بالهدف في مكان واضح أو حساب منفصل عشان ما يختلطش بالصرف اليومي. اتأكد إنك تقدر توصل للفلوس وقت الحاجة. ما تحطش ادخار قصير الأجل في منتجات مش فاهم مخاطرها أو رسومها أو شروط السحب منها.'
        ]},
        { heading: '٥. استعد للظروف غير المتوقعة', paragraphs: [
          'في شهور بتكون مصاريفها أعلى من غيرها. حدد من البداية هتتصرف إزاي: تقلل المساهمة مؤقتًا أو توقفها وقت الطوارئ أو تغير الموعد. تجنب الاستدانة لمجرد الالتزام بجدول ادخار محدد.'
        ]},
        { heading: '٦. تابع التقدم وعدل الخطة', paragraphs: [
          'راجع المبلغ مرة كل شهر وسجل قربك من الهدف. عدل التكلفة المتوقعة لو الأسعار اتغيرت، وعدل المساهمة لو دخلك اتغير. الخطة المرنة فرصتها أكبر إنها تستمر.'
        ]}
      ]
    },
    takeaway: {
      en: 'A savings goal should motivate you, not put essential expenses at risk. Choose a manageable contribution and revise the date when life changes.',
      ar: 'هدف الادخار المفروض يشجعك مش يعرض مصاريفك الأساسية للخطر. اختار مبلغ مناسب وعدل الموعد لما ظروفك تتغير.'
    }
  }
};

export function GuideArticlePage({ slug }: { slug: GuideSlug }) {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  const guide = guides[slug];
  const content = ar ? guide.sections.ar : guide.sections.en;

  return (
    <PublicPageLayout
      title={ar ? guide.title.ar : guide.title.en}
      description={ar ? guide.description.ar : guide.description.en}
    >
      <article className="public-guide-article">
        <p>{ar ? guide.intro.ar : guide.intro.en}</p>
        {content.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
          </section>
        ))}
        <p className="public-content-note">{ar ? guide.takeaway.ar : guide.takeaway.en}</p>
        <p className="public-content-note">
          {ar
            ? 'المحتوى للتثقيف العام فقط، وليس نصيحة مالية أو ضريبية أو استثمارية.'
            : 'This article is for general education only. It is not financial, tax or investment advice.'}
        </p>
        <p>
          <Link to={ar ? '/ar/guides' : '/guides'}>{ar ? 'العودة إلى دليل المال' : 'Back to all money guides'}</Link>
        </p>
        <p>
          <Link to={ar ? '/ar/' : '/'}>{ar ? 'جرّب Pocketjr Finance مجانًا' : 'Try Pocketjr Finance'}</Link>
        </p>
      </article>
    </PublicPageLayout>
  );
}
