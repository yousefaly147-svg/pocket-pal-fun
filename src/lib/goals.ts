export const GOAL_CATEGORIES = [
  'travel',
  'technology',
  'education',
  'emergency',
  'home',
  'other',
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export type SavingsGoal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  category: GoalCategory;
};

const categorySet = new Set<string>(GOAL_CATEGORIES);

/**
 * Reads both the legacy single-goal object and the multi-goal array.
 * This keeps existing savings targets and saved amounts during migration.
 */
export function normalizeGoals(value: unknown): SavingsGoal[] {
  const items: unknown[] = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? [value]
      : [];

  return items.flatMap((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const raw = item as Record<string, unknown>;
    const name = typeof raw['name'] === 'string' ? raw['name'].trim() : '';
    const target = Number(raw['target']);
    const suppliedSaved = Number(raw['saved'] ?? 0);
    if (!name || !Number.isFinite(target) || target <= 0 ||
        !Number.isFinite(suppliedSaved) || suppliedSaved < 0) return [];

    const id = typeof raw['id'] === 'string' && raw['id'].trim()
      ? raw['id']
      : `legacy-goal-${index + 1}`;
    const suppliedCategory = raw['category'];
    const category: GoalCategory = typeof suppliedCategory === 'string' && categorySet.has(suppliedCategory)
      ? suppliedCategory as GoalCategory
      : 'other';

    return [{
      id,
      name,
      target,
      saved: Math.min(suppliedSaved, Number.MAX_SAFE_INTEGER),
      category,
    }];
  });
}

export function updateGoalSaved(
  goals: SavingsGoal[],
  goalId: string,
  amount: number,
): SavingsGoal[] {
  if (!Number.isFinite(amount) || amount <= 0) return goals;
  return goals.map(goal => goal.id === goalId
    ? { ...goal, saved: Math.round((goal.saved + amount) * 100) / 100 }
    : goal);
}
