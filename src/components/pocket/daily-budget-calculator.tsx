import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { calculateDailyBudget } from '@/lib/daily-budget';
import { useI18n } from '@/lib/i18n';
import { dailyFaqs } from '@/lib/tool-content';

type Field = 'availableMoney' | 'billsDue' | 'savings' | 'daysRemaining';

const egp = (n: number) => new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 2 }).format(n);

export function DailyBudgetCalculator() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  const [v, setV] = useState<Record<Field, string>>({ availableMoney: '', billsDue: '', savings: '', daysRemaining: '' });
  const started = v.availableMoney !== '' && v.daysRemaining !== '';
  const result = calculateDailyBudget({
    availableMoney: Number(v.availableMoney),
    billsDue: Number(v.billsDue),
    savings: Number(v.savings),
    daysRemaining: Number(v.daysRemaining),
  });

  const fields: Array<{ key: Field; label: string; hint: string; unit: string; step: string }> = ar
    ? [
        { key: 'availableMoney', label: 'الفلوس اللي معاك لحد القبض الجاي', hint: 'كاش ورصيد متاح للصرف', unit: 'EGP', step: '0.01' },
        { key: 'billsDue', label: 'فواتير ومصاريف أساسية لسه عليك', hint: 'زي الإيجار أو الكهرباء أو قسط لسه ما اتدفعش', unit: 'EGP', step: '0.01' },
        { key: 'savings', label: 'مبلغ عايز تحوّشه (اختياري)', hint: 'سيبه فاضي لو مش هتدّخر الفترة دي', unit: 'EGP', step: '0.01' },
        { key: 'daysRemaining', label: 'عدد الأيام الفاضلة', hint: 'لحد يوم القبض الجاي، أيام كاملة', unit: ar ? 'يوم' : 'days', step: '1' },
      ]
    : [
        { key: 'availableMoney', label: 'Money available until next payday', hint: 'Cash and balances you can spend', unit: 'EGP', step: '0.01' },
        { key: 'billsDue', label: 'Bills and essential costs still due', hint: 'For example rent, electricity or an instalment not yet paid', unit: 'EGP', step: '0.01' },
        { key: 'savings', label: 'Amount to save (optional)', hint: 'Leave empty if you are not saving this period', unit: 'EGP', step: '0.01' },
        { key: 'daysRemaining', label: 'Days remaining', hint: 'Whole days until your next payday', unit: 'days', step: '1' },
      ];

  return (
    <PublicPageLayout
      title={ar ? 'حاسبة حد الصرف اليومي' : 'Daily spending limit calculator'}
      description={ar
        ? 'اعرف تقدر تصرف كام في اليوم لحد القبض الجاي بعد الفواتير والادخار. حاسبة مجانية بالجنيه المصري.'
        : 'Find out how much you can spend each day until your next payday after bills and savings. A free calculator in Egyptian pounds.'}
    >
      <section className="egp-calculator" aria-labelledby="daily-calc-heading">
        <div className="egp-calculator-intro">
          <span className="egp-calculator-tag">{ar ? 'أداة مجانية · EGP' : 'Free tool · EGP'}</span>
          <h2 id="daily-calc-heading">{ar ? 'احسب حد الصرف بتاعك' : 'Calculate your daily limit'}</h2>
          <p>{ar ? 'اكتب أرقامك الحقيقية؛ مفيش أرقام افتراضية. النتيجة بتتحدث وانت بتكتب.' : 'Enter your real numbers; nothing is pre-filled. The result updates as you type.'}</p>
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
                  onChange={(e) => setV((cur) => ({ ...cur, [f.key]: e.target.value }))}
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
                <strong>{egp(result.spendable)}</strong>
              </div>
              <div className="egp-calculator-result-row">
                <span>{ar ? 'عدد الأيام' : 'Days'}</span>
                <strong>{result.days}</strong>
              </div>
              <div className={`egp-calculator-final ${result.shortfall > 0 ? 'is-over' : 'is-within'}`}>
                <span>{ar ? 'تقدر تصرف في اليوم' : 'You can spend per day'}</span>
                <strong>{egp(result.dailyLimit)}</strong>
                <small>{result.shortfall > 0
                  ? (ar ? `الفواتير والادخار أكتر من الفلوس اللي معاك بـ ${egp(result.shortfall)}` : `Bills and savings exceed your money by ${egp(result.shortfall)}`)
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
          ? 'لو الفواتير والادخار أكبر من الفلوس اللي معاك، الحد اليومي بيبقى صفر والحاسبة بتوضح العجز بدل ما تديك رقم بالسالب. المبالغ بتتقرب لأقل قرش عشان ما تتعداش الميزانية.'
          : 'If bills and savings are larger than the money you have, the daily limit is zero and the calculator shows the shortfall instead of a negative number. Amounts are rounded down to the piastre so you never go over.'}</p>
        <p>{ar
          ? 'مثال للتوضيح بس (مش توصية): لو معاك 3,000 جنيه، وعليك 1,200 فواتير، وعايز تحوّش 300، وفاضل 10 أيام: (3,000 − 1,200 − 300) ÷ 10 = 150 جنيه في اليوم.'
          : 'Illustrative example only (not a recommendation): with 3,000 EGP, 1,200 EGP of bills due, 300 EGP to save and 10 days left: (3,000 − 1,200 − 300) ÷ 10 = 150 EGP a day.'}</p>

        <h2>{ar ? 'إزاي تمشي على الحد ده' : 'Sticking to the limit'}</h2>
        <ul>
          <li>{ar ? 'سجّل كل عملية صرف أول بأول عشان تعرف فاضلك كام النهارده.' : 'Record each purchase as it happens so you know what is left today.'}</li>
          <li>{ar ? 'لو صرفت أقل من الحد، الباقي بيزوّد حد الأيام الجاية لما تعيد الحساب.' : 'If you spend less than the limit, recalculating spreads the extra across the remaining days.'}</li>
          <li>{ar ? 'أعد الحساب لو جالك دخل أو ظهرت فاتورة جديدة.' : 'Recalculate whenever new income arrives or a new bill appears.'}</li>
        </ul>
        <p className="tool-cta-row">
          <a className="tool-download-button" href={ar ? '/ar/' : '/'}>{ar ? 'جرّب Pocketjr مجانًا' : 'Try Pocketjr free'}</a>
          <Link to={ar ? '/ar/monthly-expenses-template' : '/monthly-expenses-template'}>{ar ? 'حمّل جدول المصاريف الشهرية' : 'Download the monthly expenses template'}</Link>
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
          <Link to={ar ? '/ar/egp-budget-calculator' : '/egp-budget-calculator'}>{ar ? 'حاسبة الميزانية الشهرية' : 'Monthly budget calculator'}</Link>
          {' · '}
          <Link to={ar ? '/ar/savings-goals' : '/savings-goals'}>{ar ? 'إزاي تحدد هدف ادخار' : 'Setting a savings goal'}</Link>
        </p>
        <p className="public-content-note">{ar ? 'الحاسبة للتخطيط العام فقط، وليست نصيحة مالية.' : 'This calculator is for general planning only, not financial advice.'}</p>
      </section>
    </PublicPageLayout>
  );
}
