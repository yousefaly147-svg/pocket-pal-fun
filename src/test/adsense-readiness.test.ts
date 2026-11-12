import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ADSENSE_LOADER_SCRIPT, ADSENSE_SITE_VERIFICATION_META } from '@/lib/adsense-verification';

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), 'utf8');

describe('AdSense readiness', () => {
  it('uses the standard async loader with crossorigin anonymous', () => {
    expect(ADSENSE_LOADER_SCRIPT).toEqual({
      async: true,
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3201179915931193',
      crossOrigin: 'anonymous',
    });
    expect(ADSENSE_SITE_VERIFICATION_META.content).toBe('ca-pub-3201179915931193');
  });

  it('emits the loader once, only from the root shell, with no ad units', () => {
    const files = readdirSync(join(root, 'src'), { recursive: true }) as string[];
    const sources = files.filter((f) => /\.tsx?$/.test(f) && !/\.test\./.test(f));
    const users = sources.filter((f) => read(join('src', f)).includes('ADSENSE_LOADER_SCRIPT.src'));
    expect(users).toEqual([join('routes', '__root.tsx')]);
    for (const f of sources) {
      const c = read(join('src', f));
      expect(c).not.toMatch(/adsbygoogle\s*=|class(Name)?="adsbygoogle"|enable_page_level_ads/);
    }
  });

  it('publishes the Google seller record in ads.txt', () => {
    expect(read('public/ads.txt').trim()).toBe('google.com, pub-3201179915931193, DIRECT, f08c47fec0942fa0');
  });

  it('allows AdSense, Google, Bing and all crawlers without disallow rules', () => {
    const robots = read('public/robots.txt');
    for (const ua of ['Mediapartners-Google', 'Google-Display-Ads-Bot', 'Googlebot', 'Bingbot', '*']) {
      expect(robots).toMatch(new RegExp(`User-agent: ${ua.replace('*', '\\*')}\\nAllow: /`));
    }
    expect(robots).not.toMatch(/Disallow:\s*\/\S*/);
  });

  it('includes required ad disclosures in English and Arabic', () => {
    const policy = read('src/routes/privacy-policy.tsx');
    expect(policy.match(/https:\/\/adssettings\.google\.com\//g)).toHaveLength(2);
    expect(policy.match(/https:\/\/www\.aboutads\.info\/choices\//g)).toHaveLength(2);
    expect(policy).toContain('Third-party vendors, including Google, may use cookies');
    expect(policy).toContain('no ad placements are currently configured');
    expect(policy).toContain('Google-certified consent management platform');
    expect(policy).toContain('موردو جهات خارجية، بما فيهم Google');
    expect(policy).toContain('Google Analytics 4');
  });
});
