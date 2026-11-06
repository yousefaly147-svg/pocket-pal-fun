type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, params?: EventParams) => void;
  }
}

/**
 * Sends privacy-safe engagement events to the site's existing GA4 property.
 * Never pass transaction values, amounts, balances, emails, or other personal data.
 */
export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, {
    ...params,
    page_path: window.location.pathname,
  });
}
