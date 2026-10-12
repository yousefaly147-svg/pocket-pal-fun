import { useState } from 'react';
import { Check, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/cartoon';
import { CURRENCIES } from '@/lib/device-prefs';
import { useI18n } from '@/lib/i18n';
import { LangToggle } from './lang-toggle';

/** Shown once per account (on this device) before the dashboard, until a symbol is chosen. */
export function CurrencyPrompt({ onChoose, onAccountClick }: { onChoose: (code: string) => void; onAccountClick?: () => void }) {
  const i = useI18n();
  const { t } = i;
  const [code, setCode] = useState('EGP');
  const [ack, setAck] = useState(false);
  return (
    <div className="auth-shell">
      <div className="auth-top"><div className="brand"><LogoMark /><span className="brand-word">pocket<span className="brand-dot">.</span></span></div><div className="auth-top-actions">{onAccountClick && <Button type="button" variant="outline" size="sm" onClick={onAccountClick}>{t('auth.accountCta')}</Button>}<LangToggle /></div></div>
      <main className="panel currency-card">
        <h1>{t('cur.title')}</h1>
        <p className="currency-sub">{t('cur.sub')}</p>
        <div className="currency-options" role="radiogroup" aria-label={t('settings.currency')}>
          {CURRENCIES.map(c => (
            <button key={c} type="button" role="radio" aria-checked={code === c} className={`currency-option ${code === c ? 'active' : ''}`} onClick={() => setCode(c)}>
              <strong dir="ltr">{c}</strong><small>{i.currencyName(c)}</small>
            </button>
          ))}
        </div>
        <p className="currency-warning" role="note"><TriangleAlert /> <span>{t('cur.warning')}</span></p>
        <label className="currency-ack"><input type="checkbox" checked={ack} onChange={e => setAck(e.target.checked)} /> {t('cur.ack')}</label>
        <Button className="form-submit" disabled={!ack} onClick={() => onChoose(code)}><Check /> {t('cur.continue')}</Button>
      </main>
    </div>
  );
}
