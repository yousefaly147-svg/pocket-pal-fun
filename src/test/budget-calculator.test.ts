import { describe, expect, it } from 'vitest';
import { calculateMonthlyBudget } from '@/lib/budget-calculator';

describe('calculateMonthlyBudget', () => {
  it('calculates expenses, savings and remaining money correctly', () => {
    expect(calculateMonthlyBudget({
      monthlyIncome: 10000,
      fixedExpenses: 2500,
      flexibleExpenses: 3000,
      plannedSavings: 1000,
    })).toEqual({
      monthlyIncome: 10000,
      plannedExpenses: 5500,
      plannedSavings: 1000,
      remainingBeforeSavings: 4500,
      remainingAfterSavings: 3500,
      savingsRatePercent: 10,
      isOverBudget: false,
    });
  });

  it('flags a plan that exceeds monthly income', () => {
    const result = calculateMonthlyBudget({
      monthlyIncome: 5000,
      fixedExpenses: 3500,
      flexibleExpenses: 1800,
      plannedSavings: 0,
    });
    expect(result.remainingAfterSavings).toBe(-300);
    expect(result.isOverBudget).toBe(true);
  });

  it('treats negative and non-finite inputs as zero', () => {
    const result = calculateMonthlyBudget({
      monthlyIncome: Number.NaN,
      fixedExpenses: -100,
      flexibleExpenses: Number.POSITIVE_INFINITY,
      plannedSavings: 200,
    });
    expect(result.monthlyIncome).toBe(0);
    expect(result.plannedExpenses).toBe(0);
    expect(result.plannedSavings).toBe(200);
    expect(result.remainingAfterSavings).toBe(-200);
    expect(result.savingsRatePercent).toBe(0);
    expect(result.isOverBudget).toBe(true);
  });

  it('handles an empty plan without division errors', () => {
    const result = calculateMonthlyBudget({
      monthlyIncome: 0,
      fixedExpenses: 0,
      flexibleExpenses: 0,
      plannedSavings: 0,
    });
    expect(result.savingsRatePercent).toBe(0);
    expect(result.isOverBudget).toBe(false);
  });
});
