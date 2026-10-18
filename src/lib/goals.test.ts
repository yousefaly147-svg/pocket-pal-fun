import { describe, expect, it } from 'vitest';
import { normalizeGoals, updateGoalSaved } from './goals';

describe('savings goals', () => {
  it('migrates the existing single-goal object without losing its values', () => {
    expect(normalizeGoals({ name: 'New tablet', target: 15000, saved: 2500 })).toEqual([
      { id: 'legacy-goal-1', name: 'New tablet', target: 15000, saved: 2500, category: 'other' },
    ]);
  });

  it('keeps separate IDs and optional categories for multiple goals', () => {
    expect(normalizeGoals([
      { id: 'trip', name: 'Summer trip', target: 12000, saved: 3000, category: 'travel' },
      { id: 'laptop', name: 'Laptop', target: 25000, saved: 5000, category: 'technology' },
      { name: 'Emergency fund', target: 20000, saved: 0, category: 'invalid-category' },
    ])).toEqual([
      { id: 'trip', name: 'Summer trip', target: 12000, saved: 3000, category: 'travel' },
      { id: 'laptop', name: 'Laptop', target: 25000, saved: 5000, category: 'technology' },
      { id: 'legacy-goal-3', name: 'Emergency fund', target: 20000, saved: 0, category: 'other' },
    ]);
  });

  it('drops malformed goals rather than corrupting a valid goal list', () => {
    expect(normalizeGoals([
      { id: 'valid', name: 'School', target: 10000, saved: 0 },
      { id: 'bad-target', name: 'Bad', target: 0, saved: 0 },
      null,
    ])).toEqual([
      { id: 'valid', name: 'School', target: 10000, saved: 0, category: 'other' },
    ]);
  });

  it('adds progress only to the selected goal and leaves the rest unchanged', () => {
    const goals = normalizeGoals([
      { id: 'trip', name: 'Trip', target: 10000, saved: 1200, category: 'travel' },
      { id: 'laptop', name: 'Laptop', target: 20000, saved: 5000, category: 'technology' },
    ]);
    expect(updateGoalSaved(goals, 'trip', 300.257)).toEqual([
      { id: 'trip', name: 'Trip', target: 10000, saved: 1500.26, category: 'travel' },
      { id: 'laptop', name: 'Laptop', target: 20000, saved: 5000, category: 'technology' },
    ]);
  });

  it('does not mutate progress for unknown goals or invalid contributions', () => {
    const goals = normalizeGoals({ id: 'trip', name: 'Trip', target: 10000, saved: 1200 });
    expect(updateGoalSaved(goals, 'missing', 100)).toEqual(goals);
    expect(updateGoalSaved(goals, 'trip', -5)).toEqual(goals);
    expect(updateGoalSaved(goals, 'trip', Number.NaN)).toEqual(goals);
  });
});
