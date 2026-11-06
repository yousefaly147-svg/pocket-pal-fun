import ExcelJS from 'exceljs';
import { describe, expect, it } from 'vitest';
import { calculateDailyBudget } from '@/lib/daily-budget';
import { buildExpenseWorkbook } from '@/lib/expense-workbook';
import { toolSchema, publicHead } from '@/lib/public-seo';
import { dailyFaqs } from '@/lib/tool-content';

describe('daily spending limit', () => {
  it('divides money left after bills and savings by days', () => {
    expect(calculateDailyBudget({ availableMoney: 3000, billsDue: 1200, savings: 300, daysRemaining: 10 })).toEqual({ valid: true, days: 10, spendable: 1500, dailyLimit: 150, shortfall: 0 });
  });
  it('rejects zero or invalid days', () => {
    expect(calculateDailyBudget({ availableMoney: 100, billsDue: 0, savings: 0, daysRemaining: 0 }).valid).toBe(false);
    expect(calculateDailyBudget({ availableMoney: 100, billsDue: 0, savings: 0, daysRemaining: Number.NaN }).valid).toBe(false);
  });
  it('never goes negative and reports the shortfall', () => {
    const r = calculateDailyBudget({ availableMoney: 500, billsDue: 700, savings: 0, daysRemaining: 5 });
    expect(r).toMatchObject({ dailyLimit: 0, shortfall: 200 });
  });
  it('rounds down to the piastre', () => {
    expect(calculateDailyBudget({ availableMoney: 100, billsDue: 0, savings: 0, daysRemaining: 3 })).toMatchObject({ dailyLimit: 33.33 });
  });
});

describe('monthly expenses workbook', () => {
  it.each(['en', 'ar'] as const)('builds a real xlsx with 3 sheets and formulas (%s)', async (lang) => {
    const buf = await buildExpenseWorkbook(lang);
    expect(new Uint8Array(buf).slice(0, 2)).toEqual(new Uint8Array([0x50, 0x4b]));
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf);
    expect(wb.worksheets).toHaveLength(3);
    const [budget, log] = wb.worksheets;
    expect((budget!.getCell('D5').value as { formula: string }).formula).toBe('B5-C5');
    expect((budget!.getCell('C5').value as { formula: string }).formula).toContain('SUMIF');
    expect(log!.getRow(1).cellCount).toBe(6);
    expect(log!.getCell('B2').dataValidation.type).toBe('list');
    expect(log!.getCell('B2').dataValidation.formulae).toEqual(['=BudgetCategories']);
    expect(log!.getCell('E2').dataValidation.type).toBe('list');
    expect(JSON.stringify(wb.definedNames.model)).toContain('BudgetCategories');
    expect(JSON.stringify(wb.definedNames.model)).toContain(lang === 'en' ? "'Monthly budget'!$A$5:$A$19" : "'الميزانية الشهرية'!$A$5:$A$19");
    expect(budget!.views[0]?.rightToLeft).toBe(lang === 'ar');
  });
});

describe('tool page SEO', () => {
  it('self-canonical with reciprocal alternates', () => {
    const h = publicHead({ lang: 'ar', enPath: '/daily-budget-calculator', title: 't', description: 'd' });
    expect(h.links[0]).toEqual({ rel: 'canonical', href: 'https://pocketjr.lovable.app/ar/daily-budget-calculator' });
    expect(h.links.find((l) => l.hrefLang === 'x-default')?.href).toBe('https://pocketjr.lovable.app/daily-budget-calculator');
  });
  it('FAQ schema matches visible FAQ text and has no ratings', () => {
    const s = toolSchema('en', '/daily-budget-calculator', 'n', 'd', dailyFaqs.en);
    const json = JSON.stringify(s);
    expect(json).toContain(dailyFaqs.en[0]!.a);
    expect(json).not.toMatch(/aggregateRating|review|offers/);
  });
});
