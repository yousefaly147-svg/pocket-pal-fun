import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AdSenseVerification } from './adsense-verification';

const selector = 'script[data-pocketjr-adsense-verification="true"]';
const scriptUrl =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3201179915931193';

afterEach(() => {
  cleanup();
  document.head.querySelector(selector)?.remove();
});

describe('AdSense site-ownership verification', () => {
  it('adds the exact asynchronous verification script to the document head', () => {
    const { unmount } = render(<AdSenseVerification />);
    const script = document.head.querySelector<HTMLScriptElement>(selector);

    expect(script).not.toBeNull();
    expect(script?.src).toBe(scriptUrl);
    expect(script?.async).toBe(true);
    expect(script?.crossOrigin).toBe('anonymous');

    unmount();
    expect(document.head.querySelector(selector)).toBeNull();
  });

  it('does not add a duplicate when the verification script already exists', () => {
    const existing = document.createElement('script');
    existing.dataset.pocketjrAdsenseVerification = 'true';
    document.head.appendChild(existing);

    render(<AdSenseVerification />);

    expect(document.head.querySelectorAll(selector)).toHaveLength(1);
    expect(document.head.querySelector(selector)).toBe(existing);
  });
});
