import { describe, expect, it } from 'vitest';
import { toMoneyData } from '@/lib/api';
import { cashBalance, monthOptions, monthTotals, portfolio, previousMonthKey, spendingByCategory } from '@/lib/finance';
import { en } from '@/lib/i18n/en';
import { ar } from '@/lib/i18n/ar';
import { translate } from '@/lib/i18n';
import { money } from '@/lib/money-data';

const raw = {
  transactions: [
    { id: 1, type: 'income', amount: '1000', category: 'Salary', description: 'Pay', created_at: '2026-10-02T10:00:00Z' },
    { id: 2, type: 'expense', amount: 200, category: 'Food', description: 'كشري', created_at: '2026-10-03T10:00:00Z' },
    { id: 3, type: 'expense', amount: 300, category: 'Investment', description: 'Investment', created_at: '2026-10-04T10:00:00Z' },
    { id: 4, type: 'expense', amount: 100, category: 'Food', description: 'x', created_at: '2026-09-10T10:00:00Z' },
    { id: 5, type: 'bogus', amount: 1 },
  ],
  investments: [
    { id: 1, kind: 'added', amount: 300, note: '', created_at: '2026-10-04T10:00:00Z' },
    { id: 2, kind: 'gain', amount: 50, note: '', created_at: '2026-10-05T10:00:00Z' },
    { id: 3, kind: 'loss', amount: 20, note: '', created_at: '2026-10-06T10:00:00Z' },
  ],
};

describe('finance', () => {
  const data = toMoneyData(raw);
  it('normalises API rows and drops invalid ones', () => {
    expect(data.transactions).toHaveLength(4);
    expect(data.transactions[0]?.id).toBe('3');
    expect(data.transactions.find(t => t.id === '2')?.description).toBe('كشري');
  });
  it('counts an investment contribution once in cash and never as spending', () => {
    expect(cashBalance(data.transactions)).toBe(400);
    const oct = monthTotals(data.transactions, '2026-10');
    expect(oct).toMatchObject({ income: 1000, spending: 200, invested: 300 });
    expect(spendingByCategory(data.transactions, '2026-10')).toEqual([{ category: 'Food', amount: 200 }]);
  });
  it('computes portfolio value from investments only', () => {
    expect(portfolio(data.investments)).toEqual({ added: 300, gains: 50, losses: 20, value: 330 });
  });
  it('builds month options and previous month keys', () => {
    expect(monthOptions(data.transactions, data.investments, new Date('2026-10-09T12:00:00Z'))).toEqual(['2026-10', '2026-09']);
    expect(previousMonthKey('2026-01')).toBe('2025-12');
  });
});

describe('i18n', () => {
  it('has the same keys in English and Arabic', () => {
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort());
    for (const v of Object.values(ar)) expect(v.trim().length).toBeGreaterThan(0);
  });
  it('uses Western digits only in Arabic text and number formatting', () => {
    expect(Object.values(ar).join('')).not.toMatch(/[\u0660-\u0669\u06F0-\u06F9]/);
    expect(money(12345.5)).toBe('12,345.50');
  });
  it('keeps the same placeholders in both languages', () => {
    for (const k of Object.keys(en) as (keyof typeof en)[]) {
      const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
      expect(ph(ar[k]), k).toEqual(ph(en[k]));
    }
    expect(translate('ar', 'goal.there', { pct: 40 })).toContain('40');
  });
});

import { daySummary, shiftDay, dayKeyOf } from '@/lib/finance';
describe('daySummary', () => {
  const mk = (id: string, type: 'income' | 'expense', amount: number, category: string, d: Date) => ({ id, type, amount, category, description: '', createdAt: d.toISOString() });
  const day = new Date(2026, 9, 5, 10);
  const txs = [mk('1', 'income', 100, 'Salary', day), mk('2', 'expense', 30, 'Food', day), mk('3', 'expense', 20, 'Investment', day), mk('4', 'expense', 5, 'Food', new Date(2026, 9, 6, 10))];
  it('totals one local day and counts investment once', () => {
    const s = daySummary(txs, '2026-10-05');
    expect(s).toMatchObject({ income: 100, spending: 30, invested: 20, net: 50 });
    expect(s.items).toHaveLength(3);
  });
  it('shifts days', () => {
    expect(shiftDay('2026-10-01', -1)).toBe('2026-09-30');
    expect(dayKeyOf(day.toISOString())).toBe('2026-10-05');
  });
});
