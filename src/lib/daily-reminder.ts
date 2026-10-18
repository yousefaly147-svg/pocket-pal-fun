/**
 * Calculates the delay until the next local daily reminder time.
 * Browser reminders are best-effort and run only while the page stays open.
 */
export function delayUntilNextDailyReminder(time: string, now = new Date()): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!match) throw new RangeError("Reminder time must use HH:mm.");

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const next = new Date(now.getTime());
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}
