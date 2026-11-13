import { useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { calculateMonthlyBudget } from '@/lib/budget-calculator';
import { useI18n } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import { egpBudgetFaqs } from '@/lib/tool-content';

type AmountField = 'monthlyIncome' | 'fixedExpenses' | 'flexibleExpenses' | 'plannedSavings';

export function EGPBudgetCalculator() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  const hasTrackedUse = useRef(false);
  const [values, setValues] = useState<Record<AmountField, string>>({
    monthlyIncome: '',
    fixedExpenses: '',
    flexibleExpenses: '',
    plannedSavings: '',
  });

  const summary = calculateMonthlyBudget({
    monthlyIncome: Number(values.monthlyIncome),
    fixedExpenses: Number(values.fixedExpenses),
    flexibleExpenses: Number(values.flexibleExpenses),
    plannedSavings: Number(values.plannedSavings),
  });

  const formatMoney = (amount: number) => new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 2,
  }).format(amount);

  const update = (field: AmountField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const fields: Array<{ key: AmountField; label: string; hint: string }> = ar
    ? [
        { key: 'monthlyIncome', label: 'الدخل الشهري بعد الخصومات', hint: 'إجمالي المبلغ المتوقع استلامه خلال الشهر' },
        { key: 'fixedExpenses', label: 'المصاريف الثابتة والأساسية', hint: 'مثل الإيجار والفواتير والالتزامات' },
        { key: 'flexibleExpenses', label: 'الصرف المرن', hint: 'مثل الأكل والمواصلات والمشتريات' },
        { key: 'plannedSavings', label: 'مبلغ الادخار المخطط له', hint: 'المبلغ اللي حابب تخصصه للادخار هذا الشهر' },
      ]
    : [
        { key: 'monthlyIncome', label: 'Monthly take-home income', hint: 'The amount you expect to receive this month' },
        { key: 'fixedExpenses', label: 'Fixed and essential expenses', hint: 'For example, rent, bills and commitments' },
        { key: 'flexibleExpenses', label: 'Flexible spending', hint: 'For example, food, transport and personal purchases' },
        { key: 'plannedSavings', label: 'Planned monthly savings', hint: 'The amount you would like to set aside this month' },
      ];

  const title = ar ? 'حاسبة الميزانية الشهرية بالجنيه المصري' : 'Free monthly budget calculator for Egypt';
  const description = ar
    ? 'احسب مصاريفك والمتبقي من دخلك بالجنيه المصري. أدخل الدخل والمصاريف ومبلغ الادخار وشوف نتيجة خطتك فورًا.'
    : 'Plan a monthly budget in Egyptian pounds. Enter your income, expenses and savings target to see what remains after your plan.';
  const remainingLabel = ar ? 'المتبقي بعد المصاريف والادخار' : 'Remaining after expenses and savings';
  const overBudget = summary.isOverBudget;
  const statusText = overBudget
    ? (ar ? 'الخطة أعلى من الدخل' : 'Your plan is above your income')
    : (ar ? 'الخطة داخل حدود الدخل' : 'Your plan fits your income');

  return (
    <PublicPageLayout title={title} description={description}>
      <section className="egp-calculator" aria-labelledby="egp-calculator-heading">
        <div className="egp-calculator-intro">
          <span className="egp-calculator-tag">{ar ? 'أداة مجانية · EGP' : 'Free tool · EGP'}</span>
          <h2 id="egp-calculator-heading">{ar ? 'جرّب خطتك الشهرية' : 'Try your monthly plan'}</h2>
          <p>{ar
            ? 'اكتب أرقامك بالجنيه المصري. النتيجة بتتحدث تلقائيًا مع كل تغيير.'
            : 'Enter your amounts in Egyptian pounds. The result updates as you type.'}</p>
        </div>

        <div className="egp-calculator-fields">
          {fields.map((field) => (
            <label className="egp-calculator-field" key={field.key}>
              <span>{field.label}</span>
              <small>{field.hint}</small>
              <span className="egp-calculator-input-wrap">
                <input
                  aria-label={field.label}
                  dir="ltr"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0"
                  value={values[field.key]}
                  onChange={(event) => { if (!hasTrackedUse.current && event.target.value !== '') { hasTrackedUse.current = true; trackEvent('monthly_budget_calculator_started', { language: lang }); } update(field.key, event.target.value); }}
                />
                <span>EGP</span>
              </span>
            </label>
          ))}
        </div>

        <section className="egp-calculator-results" aria-live="polite" aria-atomic="true">
          <h2>{ar ? 'ملخص الميزانية' : 'Your budget summary'}</h2>
          <div className="egp-calculator-result-row">
            <span>{ar ? 'إجمالي المصاريف المخططة' : 'Total planned expenses'}</span>
            <strong>{formatMoney(summary.plannedExpenses)}</strong>
          </div>
          <div className="egp-calculator-result-row">
            <span>{ar ? 'المتبقي قبل الادخار' : 'Remaining before savings'}</span>
            <strong>{formatMoney(summary.remainingBeforeSavings)}</strong>
          </div>
          <div className="egp-calculator-result-row">
            <span>{ar ? 'الادخار المخطط' : 'Planned savings'}</span>
            <strong>{formatMoney(summary.plannedSavings)}</strong>
          </div>
          <div className={`egp-calculator-final ${overBudget ? 'is-over' : 'is-within'}`}>
            <span>{remainingLabel}</span>
            <strong>{formatMoney(summary.remainingAfterSavings)}</strong>
            <small>{statusText}</small>
          </div>
          <p className="egp-calculator-rate">
            {ar ? 'نسبة الادخار من الدخل' : 'Savings as a share of income'}: {summary.savingsRatePercent.toFixed(1)}%
          </p>
        </section>

        <section className="public-guide-article" aria-labelledby="egp-method-heading">
          <h2 id="egp-method-heading">{ar ? 'طريقة الحساب خطوة بخطوة' : 'How the calculation works'}</h2>
          <p>{ar
            ? 'المتبقي بعد المصاريف والادخار = الدخل الشهري بعد الخصومات − المصاريف الثابتة − الصرف المرن − الادخار المخطط. الحاسبة بتستخدم الأرقام اللي تدخلها أنت، ومش بتسحب بيانات من حسابك البنكي.'
            : 'Remaining after expenses and savings = take-home monthly income − fixed expenses − flexible spending − planned savings. The calculator uses only the amounts you enter; it does not read your bank account.'}</p>
          <ol>
            <li>{ar
              ? 'اكتب الدخل المتوقع استلامه فعلًا بعد الخصومات، مش الراتب قبل الخصم أو مكافأة لسه ما وصلتش.'
              : 'Enter the income you expect to receive after deductions, not gross pay or a bonus that has not arrived.'}</li>
            <li>{ar
              ? 'اجمع الالتزامات الثابتة زي الإيجار والفواتير والأقساط، وبعدها قدّر الصرف المرن زي الأكل والمواصلات والمشتريات.'
              : 'Add fixed commitments such as rent, bills and instalments, then estimate flexible spending such as food, transport and personal purchases.'}</li>
            <li>{ar
              ? 'اكتب مبلغ الادخار اللي تقدر تخصصه من غير ما تتأخر عن الاحتياجات الأساسية.'
              : 'Enter a savings amount you can set aside without falling behind on essential costs.'}</li>
            <li>{ar
              ? 'راجع المتبقي. لو بالسالب، فخطتك أعلى من الدخل بالمبلغ الظاهر؛ عدّل البنود أو موعد الهدف بدل ما تتجاهل العجز.'
              : 'Review the remainder. If it is negative, your plan exceeds income by the displayed amount; adjust the categories or goal timeline instead of ignoring the shortfall.'}</li>
          </ol>
          <h3>{ar ? 'مثال حسابي افتراضي' : 'A fictional worked example'}</h3>
          <p>{ar
            ? 'لو دخلك بعد الخصومات ١٠,٠٠٠ جنيه، ومصاريفك الثابتة ٤,٥٠٠ جنيه، والصرف المرن ٣,٠٠٠ جنيه، والادخار المخطط ٥٠٠ جنيه: المتبقي = ١٠,٠٠٠ − ٤,٥٠٠ − ٣,٠٠٠ − ٥٠٠ = ٢,٠٠٠ جنيه. راجع هل المبلغ ده محتاج يغطي فواتير سنوية أو صيانة أو مصاريف غير منتظمة قبل اعتباره متاحًا.'
            : 'Suppose take-home income is EGP 10,000, fixed expenses are EGP 4,500, flexible spending is EGP 3,000 and planned savings are EGP 500. Remaining = 10,000 − 4,500 − 3,000 − 500 = EGP 2,000. Check whether this amount still needs to cover annual bills, repairs or other irregular costs before treating it as available.'}</p>
          <h3>{ar ? 'حدود الحاسبة' : 'What this calculator does not estimate'}</h3>
          <p>{ar
            ? 'الأرقام تقديراتك أنت، والحاسبة مش بتتوقع الأسعار أو الدخل المستقبلي، ومش بتقارن إنفاقك بمتوسطات الناس. أدخل كل المبالغ بالجنيه المصري. الأداة للتخطيط العام فقط وليست نصيحة مالية.'
            : 'The figures are your estimates. The calculator does not forecast prices or future income, and it does not compare your spending with other households. Enter every amount in Egyptian pounds. This is a general planning tool, not financial advice.'}</p>
        </section>

        <p className="egp-calculator-privacy">
          {ar
            ? 'الحاسبة لا تحفظ الأرقام التي تدخلها؛ إعادة تحميل الصفحة تمسحها.'
            : 'The calculator does not save your entries. Refreshing the page clears them.'}
        </p>
        <p className="egp-calculator-disclaimer">
          {ar
            ? 'الحاسبة للتخطيط والتثقيف العام فقط، وليست نصيحة مالية. راجع التزاماتك وأرقامك الفعلية قبل اتخاذ أي قرار.'
            : 'This calculator is for general planning and education, not financial advice. Check your actual commitments and figures before making decisions.'}
        </p>
        <p className="egp-calculator-related">
          {ar ? 'محتاج خطوات لتنظيم ميزانيتك؟ ' : 'Need a step-by-step budgeting method? '}
          <Link to={ar ? '/ar/monthly-budget' : '/monthly-budget'}>
            {ar ? 'اقرأ دليل الميزانية الشهرية' : 'Read the monthly budgeting guide'}
          </Link>
        </p>

        <section className="mt-8 space-y-4" aria-labelledby="egp-calculator-faq-heading">
          <h2 id="egp-calculator-faq-heading" className="text-xl font-bold">
            {ar ? 'أسئلة شائعة عن حاسبة الميزانية' : 'Monthly budget calculator FAQs'}
          </h2>
          {egpBudgetFaqs[lang].map((faq) => (
            <details key={faq.q} className="rounded-xl border border-border p-4">
              <summary className="cursor-pointer font-semibold">{faq.q}</summary>
              <p className="mt-3 leading-7 text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </section>
      </section>
    </PublicPageLayout>
  );
}
