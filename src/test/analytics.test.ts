import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackEvent } from '@/lib/analytics';

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

  it('does nothing safely when GA4 is not available', () => {
    expect(() => trackEvent('guest_mode_started')).not.toThrow();
  });
});
