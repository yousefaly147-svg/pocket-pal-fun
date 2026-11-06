import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { PublicPageLayout } from '@/components/pocket/public-page-layout';
import { useI18n } from '@/lib/i18n';
import { TEMPLATE_FILE_NAME, templateCopy, templateFaqs } from '@/lib/tool-content';
import { trackEvent } from '@/lib/analytics';

export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export function ExpenseTemplatePage() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  const c = templateCopy[lang];
  const [file, setFile] = useState<Blob | null>(null);
  const [failed, setFailed] = useState(false);

  // Build the workbook in the browser ahead of the click so the download starts instantly (and works on iOS).
  useEffect(() => {
    let cancelled = false;
    setFile(null);
    setFailed(false);
    import('@/lib/expense-workbook')
      .then(({ buildExpenseWorkbook }) => buildExpenseWorkbook(lang))
      .then((buffer) => { if (!cancelled) setFile(new Blob([buffer], { type: XLSX_MIME })); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [lang]);


  return (
    <PublicPageLayout
      title={ar ? 'جدول مصاريف شهرية Excel جاهز (مجاني)' : 'Free monthly expenses Excel template'}
      description={ar
        ? 'حمّل جدول إكسل جاهز لميزانية البيت الشهرية بالجنيه المصري: بنود قابلة للتعديل، مخطط مقابل فعلي، وسجل للصرف اليومي بيتجمع تلقائيًا.'
        : 'Download a ready-made Excel workbook for your monthly budget in Egyptian pounds: editable categories, planned vs actual totals and a daily expense log that adds up automatically.'}
    >
      <section className="tool-download" aria-labelledby="template-download">
        <span className="egp-calculator-tag">{ar ? 'مجاني · ‎.xlsx‎ · بدون تسجيل' : 'Free · .xlsx · no sign-up'}</span>
        <h2 id="template-download">{ar ? 'حمّل الجدول' : 'Download the workbook'}</h2>
        <p>{ar
          ? 'الملف فيه 3 شيتات: الميزانية الشهرية، سجل الصرف اليومي، والتعليمات. بيفتح على Excel وGoogle Sheets وLibreOffice والموبايل.'
          : 'The file has three sheets: Monthly budget, Daily expense log and Instructions. It opens in Excel, Google Sheets, LibreOffice and phone spreadsheet apps.'}</p>
        <button
          type="button"
          className="tool-download-button"
          disabled={!file}
          aria-busy={!file && !failed}
          onClick={() => { if (!file) return; trackEvent('expense_template_downloaded', { language: lang, format: 'xlsx' }); downloadBlob(file, TEMPLATE_FILE_NAME[lang]); }}
        >
          {file ? (ar ? 'تحميل جدول المصاريف (Excel)' : 'Download Excel template (.xlsx)') : failed ? (ar ? 'تعذّر تجهيز الملف' : 'Could not prepare the file') : (ar ? 'جاري تجهيز الملف…' : 'Preparing the file…')}
        </button>
        {failed && <p role="alert">{ar ? 'حدّث الصفحة وجرّب تاني.' : 'Please refresh the page and try again.'}</p>}
        <p className="egp-calculator-privacy">{ar
          ? 'الملف بيتعمل جوه المتصفح بتاعك. مفيش أي بيانات بتترفع، والأرقام اللي هتكتبها في الجدول عمرها ما بتوصل لـ Pocketjr.'
          : 'The file is generated inside your browser. Nothing is uploaded, and the numbers you type into the workbook are never sent to Pocketjr.'}</p>
      </section>

      <section className="public-guide-article">
        <h2>{ar ? 'شيت الميزانية الشهرية' : 'Monthly budget sheet'}</h2>
        <p>{ar
          ? 'اكتب دخلك الشهري ومبلغ مخطط لكل بند. عمود الفعلي بيتحسب من سجل الصرف، والفرق = المخطط − الفعلي، وتحت الجدول هتلاقي الإجماليات والمتبقي من الدخل.'
          : 'Enter your monthly income and a planned amount per category. Actual is calculated from the daily log, Variance = Planned − Actual, and totals plus income left over appear underneath.'}</p>
        <div className="tool-table-wrap" tabIndex={0} role="region" aria-label={c.budgetSheet}>
          <table className="tool-table">
            <thead><tr>{c.budgetColumns.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>
              {c.categories.slice(0, 4).map((cat) => (
                <tr key={cat}><td>{cat}</td><td>{ar ? 'رقمك' : 'Your amount'}</td><td>{ar ? 'تلقائي' : 'Automatic'}</td><td>{ar ? 'معادلة' : 'Formula'}</td><td /></tr>
              ))}
              <tr><td colSpan={5}>{ar ? `… و${c.categories.length - 4} بنود تانية قابلة للتعديل` : `… and ${c.categories.length - 4} more editable categories`}</td></tr>
            </tbody>
          </table>
        </div>
        <p>{ar ? 'البنود الموجودة:' : 'Included categories:'} {c.categories.join(ar ? '، ' : ', ')}.</p>

        <h2>{ar ? 'شيت سجل الصرف اليومي' : 'Daily expense log sheet'}</h2>
        <p>{ar
          ? 'سجّل كل عملية صرف في سطر. البند وطريقة الدفع بيتختاروا من قائمة منسدلة عشان الإجماليات تفضل مظبوطة.'
          : 'Record each purchase on its own row. Category and payment method use drop-down lists so totals stay accurate.'}</p>
        <div className="tool-table-wrap" tabIndex={0} role="region" aria-label={c.logSheet}>
          <table className="tool-table">
            <thead><tr>{c.logColumns.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody><tr>{c.logColumns.map((h) => <td key={h}>…</td>)}</tr></tbody>
          </table>
        </div>
        <p>{ar ? 'طرق الدفع:' : 'Payment methods:'} {c.paymentMethods.join(ar ? '، ' : ', ')}.</p>

        <h2>{ar ? 'إزاي تستخدمه' : 'How to use it'}</h2>
        <ol>{c.helpSteps.map((s) => <li key={s}>{s}</li>)}</ol>

        <h2>{ar ? 'الجدول ولا التطبيق؟' : 'Spreadsheet or app?'}</h2>
        <p>{ar
          ? 'الجدول مناسب لو بتحب تشتغل على إكسل. لو عايز تسجل الصرف من الموبايل في ثواني، جرّب Pocketjr: أداة لتسجيل الدخل والمصاريف (مش بنك ولا محفظة دفع). وضع الضيف شغال من غير تسجيل بس البيانات بتفضل على الجهاز ده، ولو عملت حساب بياناتك بتتزامن بين أجهزتك.'
          : 'A spreadsheet suits you if you like working in Excel. If you would rather log spending from your phone in seconds, try Pocketjr: a recordkeeping tool for income and expenses (not a bank or payment wallet). Guest mode works without sign-up but stays on this device; with an account your records sync across devices.'}</p>
        <p className="tool-cta-row">
          <a className="tool-download-button" href={ar ? '/ar/' : '/'}>{ar ? 'جرّب Pocketjr مجانًا' : 'Try Pocketjr free'}</a>
          <Link to={ar ? '/ar/daily-budget-calculator' : '/daily-budget-calculator'}>{ar ? 'احسب حد الصرف اليومي' : 'Work out your daily spending limit'}</Link>
        </p>

        <h2>{ar ? 'أسئلة شائعة' : 'Frequently asked questions'}</h2>
        {templateFaqs[lang].map((f) => (
          <section key={f.q} className="tool-faq"><h3>{f.q}</h3><p>{f.a}</p></section>
        ))}

        <p>
          {ar ? 'اقرأ كمان: ' : 'Related: '}
          <Link to={ar ? '/ar/monthly-budget' : '/monthly-budget'}>{ar ? 'إزاي تعمل ميزانية شهرية' : 'How to make a monthly budget'}</Link>
          {' · '}
          <Link to={ar ? '/ar/expense-tracking' : '/expense-tracking'}>{ar ? 'إزاي تسجل مصاريفك اليومية' : 'How to track daily expenses'}</Link>
        </p>
        <p className="public-content-note">{ar
          ? 'الجدول أداة تنظيم وتثقيف عام، مش نصيحة مالية.'
          : 'The template is a general organisation tool, not financial advice.'}</p>
      </section>
    </PublicPageLayout>
  );
}
