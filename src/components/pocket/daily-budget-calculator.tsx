import { useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { calculateDailyBudget } from '@/lib/daily-budget';
import { useI18n } from '@/lib/i18n';
import { dailyFaqs } from '@/lib/tool-content';
import { trackEvent } from '@/lib/analytics';

type Field = 'availableMoney' | 'billsDue' | 'savings' | 'daysRemaining';

const formatAmount = (n: number, language: 'en' | 'ar') => new Intl.NumberFormat(language === 'ar' ? 'ar' : 'en', { maximumFractionDigits: 2 }).format(n);

export function DailyBudgetCalculator() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  const [v, setV] = useState<Record<Field, string>>({ availableMoney: '', billsDue: '', savings: '', daysRemaining: '' });
  const hasTrackedUse = useRef(false);
  const started = v.availableMoney !== '' && v.daysRemaining !== '';
  const result = calculateDailyBudget({
    availableMoney: Number(v.availableMoney),
    billsDue: Number(v.billsDue),
    savings: Number(v.savings),
    daysRemaining: Number(v.daysRemaining),
  });

  const fields: Array<{ key: Field; label: string; hint: string; unit: string; step: string }> = ar
    ? [
        { key: 'availableMoney', label: 'الفلوس اللي معاك لحد القبض الجاي', hint: 'كاش ورصيد متاح للصرف', unit: 'نفس العملة', step: '0.01' },
        { key: 'billsDue', label: 'فواتير ومصاريف أساسية لسه عليك', hint: 'زي الإيجار أو الكهرباء أو قسط لسه ما اتدفعش', unit: 'نفس العملة', step: '0.01' },
        { key: 'savings', label: 'مبلغ عايز تحوّشه (اختياري)', hint: 'سيبه فاضي لو مش هتدّخر الفترة دي', unit: 'نفس العملة', step: '0.01' },
        { key: 'daysRemaining', label: 'عدد الأيام الفاضلة', hint: 'لحد يوم القبض الجاي، أيام كاملة', unit: ar ? 'يوم' : 'days', step: '1' },
      ]
    : [
        { key: 'availableMoney', label: 'Money available until next payday', hint: 'Cash and balances you can spend', unit: 'same currency', step: '0.01' },
        { key: 'billsDue', label: 'Bills and essential costs still due', hint: 'For example rent, electricity or an instalment not yet paid', unit: 'same currency', step: '0.01' },
        { key: 'savings', label: 'Amount to save (optional)', hint: 'Leave empty if you are not saving this period', unit: 'same currency', step: '0.01' },
        { key: 'daysRemaining', label: 'Days remaining', hint: 'Whole days until your next payday', unit: 'days', step: '1' },
      ];

  return (
    <PublicPageLayout
      title={ar ? 'حاسبة حد الصرف اليومي حتى موعد القبض' : 'Daily budget calculator until payday'}
      description={ar
        ? 'احسب حد الصرف اليومي حتى موعد القبض بعد خصم الفواتير والادخار. استخدم أي عملة بشرط إدخال كل المبالغ بنفس العملة.'
        : 'Calculate a daily spending limit until payday after bills and planned savings. Use any currency; enter every amount in the same currency.'}
    >
      <section className="egp-calculator" aria-labelledby="daily-calc-heading">
        <div className="egp-calculator-intro">
          <span className="egp-calculator-tag">{ar ? 'أداة مجانية · أي عملة' : 'Free tool · Any currency'}</span>
          <h2 id="daily-calc-heading">{ar ? 'احسب حد الصرف بتاعك' : 'Calculate your daily limit'}</h2>
          <p>{ar ? 'استخدم نفس العملة في كل المبالغ. مفيش أرقام افتراضية، والنتيجة بتتحدث وانت بتكتب.' : 'Use the same currency for every amount. Nothing is pre-filled, and the result updates as you type.'}</p>
        </div>
        <div className="egp-calculator-fields">
          {fields.map((f) => (
            <label className="egp-calculator-field" key={f.key}>
              <span>{f.label}</span>
              <small>{f.hint}</small>
              <span className="egp-calculator-input-wrap">
                <input
                  aria-label={f.label}
                  dir="ltr"
                  type="number"
                  min={f.key === 'daysRemaining' ? '1' : '0'}
                  step={f.step}
                  inputMode={f.key === 'daysRemaining' ? 'numeric' : 'decimal'}
                  placeholder={f.key === 'daysRemaining' ? '1' : '0'}
                  value={v[f.key]}
                  onChange={(e) => { if (!hasTrackedUse.current && e.target.value !== '') { hasTrackedUse.current = true; trackEvent('daily_budget_calculator_started', { language: lang }); } setV((cur) => ({ ...cur, [f.key]: e.target.value })); }}
                />
                <span>{f.unit}</span>
              </span>
            </label>
          ))}
        </div>

        <section className="egp-calculator-results" aria-live="polite" aria-atomic="true">
          <h2>{ar ? 'النتيجة' : 'Your result'}</h2>
          {!started ? (
            <p>{ar ? 'اكتب الفلوس اللي معاك وعدد الأيام عشان تشوف الحد اليومي.' : 'Enter the money you have and the days remaining to see your daily limit.'}</p>
          ) : !result.valid ? (
            <p role="alert">{ar ? 'عدد الأيام لازم يكون يوم واحد على الأقل.' : 'Days remaining must be at least 1.'}</p>
          ) : (
            <>
              <div className="egp-calculator-result-row">
                <span>{ar ? 'المتاح للصرف بعد الفواتير والادخار' : 'Left to spend after bills and savings'}</span>
                <strong>{formatAmount(result.spendable, lang)}</strong>
              </div>
              <div className="egp-calculator-result-row">
                <span>{ar ? 'عدد الأيام' : 'Days'}</span>
                <strong>{result.days}</strong>
              </div>
              <div className={`egp-calculator-final ${result.shortfall > 0 ? 'is-over' : 'is-within'}`}>
                <span>{ar ? 'تقدر تصرف في اليوم' : 'You can spend per day'}</span>
                <strong>{formatAmount(result.dailyLimit, lang)}</strong>
                <small>{result.shortfall > 0
                  ? (ar ? `الفواتير والادخار أكتر من الفلوس اللي معاك بـ ${formatAmount(result.shortfall, lang)}` : `Bills and savings exceed your money by ${formatAmount(result.shortfall, lang)}`)
                  : (ar ? `لو التزمت بالحد ده هتوصل للقبض الجاي والفواتير والادخار متغطيين.` : 'Stick to this and your bills and savings stay covered until payday.')}</small>
              </div>
            </>
          )}
        </section>
        <p className="egp-calculator-privacy">{ar ? 'الحاسبة مش بتحفظ أرقامك ومش بتبعتها لأي مكان.' : 'The calculator does not save or send your numbers anywhere.'}</p>
      </section>

      <section className="public-guide-article">
        <h2>{ar ? 'المعادلة' : 'The formula'}</h2>
        <p className="tool-formula" dir="auto">{ar
          ? 'حد الصرف اليومي = (الفلوس المتاحة − الفواتير المستحقة − الادخار) ÷ عدد الأيام الفاضلة'
          : 'Daily limit = (money available − bills still due − savings) ÷ days remaining'}</p>
        <p>{ar
          ? 'لو الفواتير والادخار أكبر من الفلوس اللي معاك، الحد اليومي بيبقى صفر والحاسبة بتوضح العجز بدل ما تديك رقم بالسالب. المبالغ بتتقرب لأسفل لمنزلتين عشريتين عشان ما تتعداش خطتك.'
          : 'If bills and savings are larger than the money you have, the daily limit is zero and the calculator shows the shortfall instead of a negative number. Amounts are rounded down to two decimal places so you do not go over your plan.'}</p>
        <p>{ar
          ? 'مثال للتوضيح بس (مش توصية): لو معاك 3,000 من العملة اللي بتستخدمها، وعليك 1,200 فواتير، وعايز تحوّش 300، وفاضل 10 أيام: (3,000 − 1,200 − 300) ÷ 10 = 150 من نفس العملة في اليوم.'
          : 'Illustrative example only (not a recommendation): enter 3,000 in your chosen currency, 1,200 of bills due, 300 to save and 10 days left: (3,000 − 1,200 − 300) ÷ 10 = 150 per day in that same currency.'}</p>

        <h2>{ar ? 'إزاي تمشي على الحد ده' : 'Sticking to the limit'}</h2>
        <ul>
          <li>{ar ? 'سجّل كل عملية صرف أول بأول عشان تعرف فاضلك كام النهارده.' : 'Record each purchase as it happens so you know what is left today.'}</li>
          <li>{ar ? 'لو صرفت أقل من الحد، الباقي بيزوّد حد الأيام الجاية لما تعيد الحساب.' : 'If you spend less than the limit, recalculating spreads the extra across the remaining days.'}</li>
          <li>{ar ? 'أعد الحساب لو جالك دخل أو ظهرت فاتورة جديدة.' : 'Recalculate whenever new income arrives or a new bill appears.'}</li>
        </ul>
        <p className="tool-cta-row">
          <a className="tool-download-button" href={ar ? '/ar/' : '/'}>{ar ? 'جرّب Pocketjr مجانًا' : 'Try Pocketjr free'}</a>
          <Link to={ar ? '/ar/monthly-expenses-template' : '/monthly-expenses-template'}>{ar ? 'حمّل جدول المصاريف الشهرية بالجنيه المصري' : 'Download the EGP monthly expenses template'}</Link>
        </p>
        <p>{ar
          ? 'Pocketjr أداة لتسجيل الدخل والمصاريف، مش بنك ولا محفظة دفع. وضع الضيف شغال من غير تسجيل بس بيفضل على الجهاز ده.'
          : 'Pocketjr is a recordkeeping tool for income and expenses, not a bank or payment wallet. Guest mode works without sign-up but stays on this device.'}</p>

        <h2>{ar ? 'أسئلة شائعة' : 'Frequently asked questions'}</h2>
        {dailyFaqs[lang].map((f) => (
          <section key={f.q} className="tool-faq"><h3>{f.q}</h3><p>{f.a}</p></section>
        ))}
        <p>
          {ar ? 'أدوات وأدلة تانية: ' : 'More tools and guides: '}
          <Link to={ar ? '/ar/egp-budget-calculator' : '/egp-budget-calculator'}>{ar ? 'حاسبة الميزانية بالجنيه المصري' : 'Egyptian pound budget calculator'}</Link>
          {' · '}
          <Link to={ar ? '/ar/savings-goals' : '/savings-goals'}>{ar ? 'إزاي تحدد هدف ادخار' : 'Setting a savings goal'}</Link>
        </p>
        <p className="public-content-note">{ar ? 'الحاسبة للتخطيط العام فقط، وليست نصيحة مالية.' : 'This calculator is for general planning only, not financial advice.'}</p>
      </section>
    </PublicPageLayout>
  );
}
