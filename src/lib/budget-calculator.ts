export type MonthlyBudgetInputs = {
  monthlyIncome: number;
  fixedExpenses: number;
  flexibleExpenses: number;
  plannedSavings: number;
};

export type MonthlyBudgetSummary = {
  monthlyIncome: number;
  plannedExpenses: number;
  plannedSavings: number;
  remainingBeforeSavings: number;
  remainingAfterSavings: number;
  savingsRatePercent: number;
  isOverBudget: boolean;
};

function safeAmount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

/** Calculates an illustrative monthly plan in the user's entered currency (Pocketjr displays EGP on this page). */
export function calculateMonthlyBudget(input: MonthlyBudgetInputs): MonthlyBudgetSummary {
  const monthlyIncome = safeAmount(input.monthlyIncome);
  const fixedExpenses = safeAmount(input.fixedExpenses);
  const flexibleExpenses = safeAmount(input.flexibleExpenses);
  const plannedSavings = safeAmount(input.plannedSavings);
  const plannedExpenses = fixedExpenses + flexibleExpenses;
  const remainingBeforeSavings = monthlyIncome - plannedExpenses;
  const remainingAfterSavings = remainingBeforeSavings - plannedSavings;

  return {
    monthlyIncome,
    plannedExpenses,
    plannedSavings,
    remainingBeforeSavings,
    remainingAfterSavings,
    savingsRatePercent: monthlyIncome > 0 ? (plannedSavings / monthlyIncome) * 100 : 0,
    isOverBudget: remainingAfterSavings < 0,
  };
}
