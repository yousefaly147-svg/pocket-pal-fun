import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, type TKey } from './en';
import { ar } from './ar';
import { isKnownCategory, money, wholeMoney } from '../money-data';

export type Lang = 'en' | 'ar';
export type { TKey };
export const LANG_KEY = 'pocket_lang';
const dictionaries: Record<Lang, Record<TKey, string>> = { en, ar };

/** Runs before hydration so the first paint already has the right direction. */
export const langBootScript = `try{var l=localStorage.getItem('${LANG_KEY}')==='ar'?'ar':'en';document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';}catch(e){}`;

/** The language already applied to <html> by the boot script (browser only). */
function initialLang(): Lang {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

export function translate(lang: Lang, key: TKey, vars?: Record<string, string | number>) {
  const template = dictionaries[lang][key] ?? en[key] ?? key;
  vars = { cur: 'EGP', ...vars };
  return vars ? template.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`)) : template;
}

// Dates use Western digits in both languages (nu-latn).
const dateLocale = (lang: Lang) => (lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB');

function makeApi(lang: Lang, currency: string) {
  const t = (key: TKey, vars?: Record<string, string | number>) => translate(lang, key, { cur: currency, ...vars });
  return {
    lang,
    currency,
    currencyName: (code: string) => { try { return new Intl.DisplayNames([lang === 'ar' ? 'ar' : 'en'], { type: 'currency' }).of(code) ?? code; } catch { return code; } },
    dir: (lang === 'ar' ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    t,
    money,
    wholeMoney,
    date: (iso: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(
      dateLocale(lang),
      { ...opts, ...(opts.hour || opts.minute ? { hourCycle: 'h12' as const } : {}) },
    ).format(new Date(iso)),
    month: (key: string) => {
      const [y = 1970, m = 1] = key.split('-').map(Number);
      return new Intl.DateTimeFormat(dateLocale(lang), { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1));
    },
    /** Known API categories are translated; anything else is user/back-end text and shown as-is. */
    category: (c: string) => (isKnownCategory(c) ? t(`cat.${c}` as TKey) : c),
  };
}

type I18nCtx = ReturnType<typeof makeApi> & { setLang: (l: Lang) => void; setCurrency: (c: string) => void };
const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Start from what the boot script already put on <html>, so there is no English flash
  // and nothing ever writes the wrong direction back over it on refresh.
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [currency, setCurrency] = useState('EGP');
  useEffect(() => {
    let saved: Lang = lang;
    try { saved = localStorage.getItem(LANG_KEY) === 'ar' ? 'ar' : 'en'; } catch { /* ignore */ }
    if (saved !== lang) setLangState(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const el = document.documentElement;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (el.lang !== lang) el.lang = lang;
    if (el.dir !== dir) el.dir = dir;
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ }
  }, []);
  const value = useMemo(() => ({ ...makeApi(lang, currency), setLang, setCurrency }), [lang, currency, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
