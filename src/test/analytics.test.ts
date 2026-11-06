import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackEvent, trackPageView } from '@/lib/analytics';

describe('privacy-safe acquisition analytics', () => {
  afterEach(() => {
    delete window.gtag;
    window.history.replaceState({}, '', '/');
  });

  it('sends an event with the current page path and no financial inputs', () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    window.history.replaceState({}, '', '/monthly-expenses-template');

    trackEvent('expense_template_downloaded', { language: 'en', format: 'xlsx' });

    expect(gtag).toHaveBeenCalledWith('event', 'expense_template_downloaded', {
      language: 'en',
      format: 'xlsx',
      page_path: '/monthly-expenses-template',
    });
  });

  it('records SPA page views without query-string values', () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    window.history.replaceState({}, '', '/daily-budget-calculator?email=private@example.com');
    document.title = 'Daily budget calculator';

    trackPageView();

    expect(gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/daily-budget-calculator',
      page_location: `${window.location.origin}/daily-budget-calculator`,
      page_title: 'Daily budget calculator',
    });
  });

  it('does nothing safely when GA4 is not available', () => {
    expect(() => trackEvent('guest_mode_started')).not.toThrow();
    expect(() => trackPageView()).not.toThrow();
  });
});
