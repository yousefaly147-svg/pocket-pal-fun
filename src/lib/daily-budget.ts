export type DailyBudgetInputs = {
  availableMoney: number;
  billsDue: number;
  savings: number;
  daysRemaining: number;
};

export type DailyBudgetResult =
  | { valid: false; reason: 'days' }
  | {
      valid: true;
      days: number;
      spendable: number;
      dailyLimit: number;
      shortfall: number;
    };

const amount = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);

/**
 * Daily limit = (money available − bills still due − savings) ÷ whole days remaining.
 * Days must be a whole number of at least 1; a plan that doesn't fit returns a shortfall and a 0 limit.
 */
export function calculateDailyBudget(input: DailyBudgetInputs): DailyBudgetResult {
  const days = Number.isFinite(input.daysRemaining) ? Math.floor(input.daysRemaining) : 0;
  if (days < 1) return { valid: false, reason: 'days' };
  const left = amount(input.availableMoney) - amount(input.billsDue) - amount(input.savings);
  const spendable = Math.max(0, left);
  return {
    valid: true,
    days,
    spendable,
    dailyLimit: Math.floor((spendable / days) * 100) / 100,
    shortfall: left < 0 ? -left : 0,
  };
}
