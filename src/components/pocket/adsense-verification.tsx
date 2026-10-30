import { useEffect } from 'react';

const ADSENSE_SCRIPT_SELECTOR = 'script[data-pocketjr-adsense-verification="true"]';
const ADSENSE_SCRIPT_URL =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3201179915931193';

/**
 * Loads the AdSense site-ownership verification script only while a public page
 * is mounted. It does not create ad units or enable automatic ad placements.
 */
export function AdSenseVerification() {
  useEffect(() => {
    if (document.head.querySelector(ADSENSE_SCRIPT_SELECTOR)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = ADSENSE_SCRIPT_URL;
    script.crossOrigin = 'anonymous';
    script.dataset['pocketjrAdsenseVerification'] = 'true';
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
