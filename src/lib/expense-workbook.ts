import ExcelJS from 'exceljs';
import { templateCopy, type TemplateLang } from './tool-content';

export const LOG_ROWS = 300;

/** Builds the bilingual monthly expenses workbook entirely in memory (never uploaded). */
export async function buildExpenseWorkbook(lang: TemplateLang): Promise<ArrayBuffer> {
  const c = templateCopy[lang];
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Pocketjr Finance';
  const rtl = lang === 'ar';
  const view = [{ rightToLeft: rtl, state: 'frozen' as const, ySplit: 4 }];
  const bold = { bold: true, name: 'Arial' };
  const header = (row: ExcelJS.Row) => {
    row.font = { ...bold, color: { argb: 'FFFFFFFF' } };
    row.eachCell((cell) => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F6B55' } }; });
  };
  const money = '#,##0.00;(#,##0.00);"-"';

  const budget = wb.addWorksheet(c.budgetSheet, { views: view });
  const log = wb.addWorksheet(c.logSheet, { views: [{ rightToLeft: rtl, state: 'frozen', ySplit: 1 }] });
  const help = wb.addWorksheet(c.helpSheet, { views: [{ rightToLeft: rtl }] });
  const logRef = `'${c.logSheet}'`;

  budget.columns = [{ width: 30 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 32 }];
  budget.getCell('A1').value = c.budgetTitle;
  budget.getCell('A1').font = { ...bold, size: 14 };
  budget.getCell('A2').value = c.incomeLabel;
  budget.getCell('A2').font = bold;
  budget.getCell('B2').numFmt = money;
  budget.getCell('B2').font = { name: 'Arial', color: { argb: 'FF0000FF' } };
  header(budget.getRow(4));
  budget.getRow(4).values = c.budgetColumns;
  header(budget.getRow(4));

  const first = 5;
  c.categories.forEach((name, i) => {
    const r = first + i;
    budget.getCell(`A${r}`).value = name;
    budget.getCell(`B${r}`).numFmt = money;
    budget.getCell(`B${r}`).font = { name: 'Arial', color: { argb: 'FF0000FF' } };
    budget.getCell(`C${r}`).value = { formula: `SUMIF(${logRef}!$B$2:$B$${LOG_ROWS + 1},A${r},${logRef}!$D$2:$D$${LOG_ROWS + 1})` };
    budget.getCell(`D${r}`).value = { formula: `B${r}-C${r}` };
    for (const col of ['C', 'D']) budget.getCell(`${col}${r}`).numFmt = money;
  });
  const last = first + c.categories.length - 1;
  const total = last + 1;
  budget.getCell(`A${total}`).value = c.totalLabel;
  for (const col of ['B', 'C', 'D']) {
    budget.getCell(`${col}${total}`).value = { formula: `SUM(${col}${first}:${col}${last})` };
    budget.getCell(`${col}${total}`).numFmt = money;
  }
  budget.getRow(total).font = bold;
  budget.getCell(`A${total + 2}`).value = c.remainingPlannedLabel;
  budget.getCell(`B${total + 2}`).value = { formula: `B2-B${total}` };
  budget.getCell(`A${total + 3}`).value = c.remainingActualLabel;
  budget.getCell(`B${total + 3}`).value = { formula: `B2-C${total}` };
  for (const r of [total + 2, total + 3]) { budget.getCell(`B${r}`).numFmt = money; budget.getRow(r).font = bold; }

  log.columns = [{ width: 14 }, { width: 24 }, { width: 32 }, { width: 16 }, { width: 18 }, { width: 30 }];
  log.getRow(1).values = c.logColumns;
  header(log.getRow(1));
  for (let r = 2; r <= LOG_ROWS + 1; r++) {
    log.getCell(`A${r}`).numFmt = 'yyyy-mm-dd';
    log.getCell(`D${r}`).numFmt = money;
    log.getCell(`B${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: [`'${c.budgetSheet}'!$A$${first}:$A$${last}`] };
    log.getCell(`E${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${c.paymentMethods.join(',')}"`] };
  }

  help.getColumn(1).width = 100;
  help.getCell('A1').value = c.helpTitle;
  help.getCell('A1').font = { ...bold, size: 14 };
  c.helpSteps.forEach((step, i) => {
    const cell = help.getCell(`A${i + 3}`);
    cell.value = `${i + 1}. ${step}`;
    cell.alignment = { wrapText: true, vertical: 'top' };
  });

  return wb.xlsx.writeBuffer() as Promise<ArrayBuffer>;
}
