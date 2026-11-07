// Browser-safe shared copy for the free tool pages. FAQ text here is rendered on-page
// and reused verbatim in FAQPage structured data, so the two can never drift apart.
export type TemplateLang = 'en' | 'ar';
export type Faq = { q: string; a: string };

export const TEMPLATE_FILE_NAME: Record<TemplateLang, string> = {
  en: 'pocketjr-monthly-expenses-template.xlsx',
  ar: 'pocketjr-جدول-مصاريف-شهرية.xlsx',
};

export const templateCopy = {
  en: {
    budgetSheet: 'Monthly budget',
    logSheet: 'Daily expense log',
    helpSheet: 'Instructions',
    budgetTitle: 'Monthly budget (EGP)',
    incomeLabel: 'Monthly income (EGP)',
    budgetColumns: ['Category', 'Planned (EGP)', 'Actual (EGP)', 'Variance (EGP)', 'Notes'],
    totalLabel: 'Total',
    remainingPlannedLabel: 'Income left after planned spending (EGP)',
    remainingActualLabel: 'Income left after actual spending (EGP)',
    logColumns: ['Date', 'Category', 'Description', 'Amount (EGP)', 'Payment method', 'Notes'],
    categories: ['Rent / housing', 'Electricity', 'Water and gas', 'Internet and mobile', 'Groceries', 'Eating out', 'Transport and fuel', 'Education', 'Health and medicine', 'Personal care and clothes', 'Outings and entertainment', 'Gifts and occasions', 'Debt or instalments', 'Savings', 'Other'],
    paymentMethods: ['Cash', 'Debit card', 'Credit card', 'Wallet', 'Bank transfer', 'Other'],
    helpTitle: 'How to use this template',
    helpSteps: [
      'Enter your expected monthly income in cell B2 of the Monthly budget sheet.',
      'Type a planned amount for each category in the Planned column. Rename, add or delete categories to match your life; there are no suggested amounts.',
      'Every time you spend, add a row to the Daily expense log with the date, category, description, amount and payment method.',
      'The Actual column adds up the log for each category automatically, and Variance shows Planned minus Actual. A negative variance means you spent more than planned.',
      'Review the totals weekly and adjust your plan. Start a fresh copy of the file each month.',
      'This file was created in your browser. Pocketjr did not receive or store any of your numbers.',
    ],
  },
  ar: {
    budgetSheet: 'الميزانية الشهرية',
    logSheet: 'سجل الصرف اليومي',
    helpSheet: 'التعليمات',
    budgetTitle: 'الميزانية الشهرية (جنيه مصري)',
    incomeLabel: 'الدخل الشهري (جنيه)',
    budgetColumns: ['البند', 'المخطط (جنيه)', 'الفعلي (جنيه)', 'الفرق (جنيه)', 'ملاحظات'],
    totalLabel: 'الإجمالي',
    remainingPlannedLabel: 'المتبقي من الدخل بعد الصرف المخطط (جنيه)',
    remainingActualLabel: 'المتبقي من الدخل بعد الصرف الفعلي (جنيه)',
    logColumns: ['التاريخ', 'البند', 'الوصف', 'المبلغ (جنيه)', 'طريقة الدفع', 'ملاحظات'],
    categories: ['الإيجار / السكن', 'الكهرباء', 'المياه والغاز', 'الإنترنت والموبايل', 'البقالة وطلبات البيت', 'الأكل برا', 'المواصلات والبنزين', 'التعليم والدروس', 'الصحة والأدوية', 'العناية الشخصية واللبس', 'الخروجات والترفيه', 'الهدايا والمناسبات', 'الأقساط والديون', 'الادخار', 'أخرى'],
    paymentMethods: ['كاش', 'كارت خصم', 'كارت ائتمان', 'محفظة', 'تحويل بنكي', 'أخرى'],
    helpTitle: 'إزاي تستخدم الجدول',
    helpSteps: [
      'اكتب دخلك الشهري المتوقع في الخلية B2 في شيت الميزانية الشهرية.',
      'اكتب المبلغ المخطط لكل بند في عمود المخطط. غيّر أسماء البنود أو زوّد أو امسح حسب ظروفك؛ مفيش مبالغ مقترحة.',
      'كل ما تصرف، زوّد سطر في سجل الصرف اليومي فيه التاريخ والبند والوصف والمبلغ وطريقة الدفع.',
      'عمود الفعلي بيجمع السجل لكل بند تلقائيًا، وعمود الفرق بيطرح الفعلي من المخطط. لو الفرق بالسالب يبقى صرفت أكتر من المخطط.',
      'راجع الإجماليات كل أسبوع وعدّل خطتك. ابدأ نسخة جديدة من الملف كل شهر.',
      'الملف ده اتعمل جوه المتصفح بتاعك. Pocketjr ما استلمش ولا حفظ أي رقم من أرقامك.',
    ],
  },
} satisfies Record<TemplateLang, Record<string, unknown>>;

export const templateFaqs: Record<TemplateLang, Faq[]> = {
  en: [
    { q: 'Is the monthly expenses template really free?', a: 'Yes. The Excel file is free to download and use, and you do not need an account.' },
    { q: 'Does it work in Google Sheets or on my phone?', a: 'Yes. It is a standard .xlsx file, so you can open it in Microsoft Excel, Google Sheets, LibreOffice or a phone spreadsheet app. Formulas and drop-down lists work in all of them.' },
    { q: 'Are my numbers sent to Pocketjr?', a: 'No. The file is built inside your browser when you click download. Nothing you type in the workbook is uploaded to Pocketjr.' },
    { q: 'Why are there no suggested amounts?', a: 'Costs differ a lot between households and cities, so the template starts empty. You enter your own planned amounts based on your real bills.' },
  ],
  ar: [
    { q: 'هل جدول المصاريف الشهرية مجاني فعلًا؟', a: 'أيوه. ملف الإكسل مجاني للتحميل والاستخدام، ومش محتاج تعمل حساب.' },
    { q: 'ينفع أفتحه على Google Sheets أو الموبايل؟', a: 'أيوه. الملف بصيغة ‎.xlsx‎ العادية، فتقدر تفتحه على Excel أو Google Sheets أو LibreOffice أو أي تطبيق جداول على الموبايل، والمعادلات والقوائم المنسدلة شغالة.' },
    { q: 'هل أرقامي بتتبعت لـ Pocketjr؟', a: 'لأ. الملف بيتعمل جوه المتصفح بتاعك لما تدوس تحميل، وأي رقم تكتبه في الجدول مش بيترفع على Pocketjr.' },
    { q: 'ليه مفيش مبالغ مقترحة في الجدول؟', a: 'الأسعار بتختلف جدًا من بيت لبيت ومن مدينة لمدينة، فالجدول بيبدأ فاضي وانت بتكتب أرقامك الحقيقية حسب فواتيرك.' },
  ],
};

export const dailyFaqs: Record<TemplateLang, Faq[]> = {
  en: [
    { q: 'Can I use the calculator with any currency?', a: 'Yes. Enter every amount in the same currency. The calculator does not convert currencies; it divides the amounts you enter and shows the result in that same currency.' },
    { q: 'How is the daily spending limit calculated?', a: 'Take the money you have until your next payday, subtract bills and essential costs that are still due and any amount you want to save, then divide what is left by the number of days remaining.' },
    { q: 'What if the result is zero?', a: 'A zero limit means your bills and savings already use all the money you have. The calculator shows the shortfall so you can lower the savings amount, delay a non-essential cost or look for extra income.' },
    { q: 'Should I count today as a day remaining?', a: 'Count today if you still plan to spend today. Using whole days keeps the limit easy to follow.' },
    { q: 'Does the calculator save my numbers?', a: 'No. Everything is calculated in your browser and nothing is stored or sent to Pocketjr. Refreshing the page clears it.' },
  ],
  ar: [
    { q: 'ينفع أستخدم الحاسبة بأي عملة؟', a: 'أيوه. أدخل كل المبالغ بنفس العملة. الحاسبة مش بتحوّل العملات؛ هي بتقسم الأرقام اللي بتدخلها وبتعرض النتيجة بنفس العملة.' },
    { q: 'حد الصرف اليومي بيتحسب إزاي؟', a: 'بناخد الفلوس اللي معاك لحد القبض الجاي، ونطرح منها الفواتير والمصاريف الأساسية اللي لسه عليك وأي مبلغ عايز تحوّشه، وبعدين نقسم الباقي على عدد الأيام الفاضلة.' },
    { q: 'لو النتيجة طلعت صفر يعني إيه؟', a: 'يعني الفواتير والادخار واخدين كل الفلوس اللي معاك. الحاسبة بتوضح العجز عشان تقلل مبلغ الادخار أو تأجل مصروف مش أساسي أو تدور على دخل إضافي.' },
    { q: 'أحسب النهارده من الأيام الفاضلة؟', a: 'احسبه لو لسه هتصرف النهارده. استخدام أيام كاملة بيخلي الحد سهل تمشي عليه.' },
    { q: 'الحاسبة بتحفظ أرقامي؟', a: 'لأ. كل الحسابات بتتم جوه المتصفح ومفيش حاجة بتتحفظ أو بتتبعت لـ Pocketjr. لو عملت تحديث للصفحة الأرقام بتتمسح.' },
  ],
};

export const egpBudgetFaqs: Record<TemplateLang, Faq[]> = {
  en: [
    { q: 'How does the monthly EGP budget calculator work?', a: 'Enter your take-home income, fixed expenses, flexible spending and planned savings. The calculator totals your planned expenses and shows what remains before and after savings.' },
    { q: 'Does the calculator save or send the amounts I enter?', a: 'No. The calculation runs in your browser. Your entries are not saved or sent to Pocketjr, and refreshing the page clears them.' },
    { q: 'What does a negative remaining amount mean?', a: 'It means your planned expenses and savings are greater than the income you entered. Review the figures and adjust your plan before relying on it.' },
    { q: 'Does this calculator convert other currencies into EGP?', a: 'No. It is an Egyptian-pound planning calculator. It does not fetch exchange rates or convert amounts from another currency.' },
  ],
  ar: [
    { q: 'الحاسبة الشهرية بالجنيه المصري بتشتغل إزاي؟', a: 'اكتب صافي دخلك والمصاريف الثابتة والصرف المرن ومبلغ الادخار المخطط. الحاسبة بتجمع المصاريف وبتوضح المتبقي قبل الادخار وبعده.' },
    { q: 'الحاسبة بتحفظ الأرقام اللي بدخلها أو بتبعتها؟', a: 'لأ. الحساب بيتم جوه المتصفح. الأرقام اللي بتدخلها مش بتتحفظ ولا بتتبعت لـ Pocketjr، ولو عملت تحديث للصفحة بتتمسح.' },
    { q: 'يعني إيه لو المتبقي طلع بالسالب؟', a: 'ده معناه إن المصاريف والادخار المخطط ليهم أكبر من الدخل اللي دخلته. راجع الأرقام وعدّل الخطة قبل ما تعتمد عليها.' },
    { q: 'الحاسبة بتحوّل العملات التانية للجنيه المصري؟', a: 'لأ. دي حاسبة للتخطيط بالجنيه المصري، ومش بتجيب أسعار صرف ولا بتحوّل مبالغ من عملة تانية.' },
  ],
};
