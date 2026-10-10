// Category definitions shared by the UI. Category values are the exact strings the
// My Money API stores; they are translated only for display.
export const expenseCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Education', 'Health', 'Other'] as const;
export const incomeCategories = ['Salary', 'Gift', 'Winnings', 'Other'] as const;
export const INVESTMENT_CATEGORY = 'Investment';
export const knownCategories: string[] = Array.from(new Set<string>([...expenseCategories, ...incomeCategories, INVESTMENT_CATEGORY]));

export function isKnownCategory(c: string) {
  return knownCategories.includes(c);
}
export function categorySlug(c: string) {
  return isKnownCategory(c) ? c.toLowerCase() : 'other';
}

/** Amount formatting always uses Western digits (0-9) in every language. */
const moneyFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const intFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
export const money = (value: number) => moneyFormat.format(value);
export const wholeMoney = (value: number) => intFormat.format(Math.round(value));
