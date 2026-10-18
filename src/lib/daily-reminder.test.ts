import { describe, expect, it } from "vitest";
import { delayUntilNextDailyReminder } from "./daily-reminder";

describe("delayUntilNextDailyReminder", () => {
  it("returns the remaining time when the selected time is later today", () => {
    const now = new Date(2026, 9, 18, 19, 0, 0, 0);
    expect(delayUntilNextDailyReminder("20:00", now)).toBe(60 * 60 * 1000);
  });

  it("moves the reminder to tomorrow when today's time has passed", () => {
    const now = new Date(2026, 9, 18, 20, 30, 0, 0);
    expect(delayUntilNextDailyReminder("20:00", now)).toBe(23 * 60 * 60 * 1000 + 30 * 60 * 1000);
  });

  it("rejects malformed times rather than scheduling an unexpected notification", () => {
    expect(() => delayUntilNextDailyReminder("25:00")).toThrow(RangeError);
    expect(() => delayUntilNextDailyReminder("8 PM")).toThrow(RangeError);
  });
});
