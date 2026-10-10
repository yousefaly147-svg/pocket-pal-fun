import type { Investment, Transaction } from './api';
import { INVESTMENT_CATEGORY } from './money-data';

// Investment contributions are stored twice by design: an investment entry
// (kind "added") AND an expense transaction in category "Investment".
// Cash balance counts that expense once; spending charts exclude it so it is
// not mistaken for consumption; portfolio value comes only from investments.

export function monthKeyOf(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
export function currentMonthKey(now = new Date()) {
  return monthKeyOf(now.toISOString());
}
export function previousMonthKey(key: string) {
  const [y = 1970, m = 1] = key.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function cashBalance(txs: Transaction[]) {
  return round2(txs.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0));
}

export function monthTotals(txs: Transaction[], key: string) {
  let income = 0, spending = 0, invested = 0, count = 0;
  for (const t of txs) {
    if (monthKeyOf(t.createdAt) !== key) continue;
    count++;
    if (t.type === 'income') income += t.amount;
    else if (t.category === INVESTMENT_CATEGORY) invested += t.amount;
    else spending += t.amount;
  }
  return { income: round2(income), spending: round2(spending), invested: round2(invested), count };
}

export function spendingByCategory(txs: Transaction[], key: string) {
  const map = new Map<string, number>();
  for (const t of txs) {
    if (t.type !== 'expense' || t.category === INVESTMENT_CATEGORY || monthKeyOf(t.createdAt) !== key) continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  return Array.from(map, ([category, amount]) => ({ category, amount: round2(amount) })).sort((a, b) => b.amount - a.amount);
}

export function portfolio(invs: Investment[]) {
  let added = 0, gains = 0, losses = 0;
  for (const i of invs) {
    if (i.kind === 'added') added += i.amount;
    else if (i.kind === 'gain') gains += i.amount;
    else losses += i.amount;
  }
  return { added: round2(added), gains: round2(gains), losses: round2(losses), value: round2(added + gains - losses) };
}

export function monthOptions(txs: Transaction[], invs: Investment[], now = new Date()) {
  const keys = new Set<string>([currentMonthKey(now)]);
  for (const x of [...txs, ...invs]) { const k = monthKeyOf(x.createdAt); if (k) keys.add(k); }
  return Array.from(keys).sort().reverse();
}

/** Local calendar day key (YYYY-MM-DD) in the device's time zone. */
export function dayKeyOf(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function shiftDay(key: string, delta: number) {
  const [y = 1970, m = 1, d = 1] = key.split('-').map(Number);
  return dayKeyOf(new Date(y, m - 1, d + delta, 12).toISOString());
}

/** One day's figures. Net change is the cash movement (income minus all expenses, investment contributions included once). */
export function daySummary(txs: Transaction[], key: string) {
  let income = 0, spending = 0, invested = 0;
  const items = txs.filter(t => dayKeyOf(t.createdAt) === key);
  for (const t of items) {
    if (t.type === 'income') income += t.amount;
    else if (t.category === INVESTMENT_CATEGORY) invested += t.amount;
    else spending += t.amount;
  }
  return { income: round2(income), spending: round2(spending), invested: round2(invested), net: round2(income - spending - invested), items };
}
