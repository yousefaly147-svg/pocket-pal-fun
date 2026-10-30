import { ArrowRight, ChartNoAxesCombined, Languages, LogIn, ShieldCheck, Sparkles, TrendingUp, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoMark, WalletFriend } from '@/components/cartoon';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { LangToggle } from './lang-toggle';

function makeGuestId() {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function startWithEgp(startGuest: (guestId: string) => void) {
  let guestId = makeGuestId();
  try {
    guestId = localStorage.getItem('pocket_guest_id') || guestId;
    localStorage.setItem('pocket_guest_id', guestId);
    const prefsKey = `pocket:device:guest-${guestId}`;
    let previous: Record<string, unknown> = {};
    try {
      previous = JSON.parse(localStorage.getItem(prefsKey) ?? '{}') as Record<string, unknown>;
    } catch { /* use defaults */ }
    localStorage.setItem(prefsKey, JSON.stringify({
      budget: typeof previous['budget'] === 'number' ? previous['budget'] : null,
      goal: previous['goal'] ?? null,
      currency: typeof previous['currency'] === 'string' ? previous['currency'] : 'EGP',
    }));
  } catch { /* guest mode can still start for this visit if storage is unavailable */ }
  startGuest(guestId);
}

export function LandingPage() {
  const { openAuthScreen, startGuest } = useAuth();
  const { t, lang } = useI18n();
  const ar = lang === 'ar';
  const pagePath = (path: string) => ar ? (path === '/' ? '/ar/' : `/ar${path}`) : path;

  return (
    <div className="public-landing" dir={ar ? 'rtl' : 'ltr'}>
      <header className="landing-nav">
        <a className="landing-brand" href={pagePath('/')} aria-label="Pocket Pal home">
          <LogoMark />
          <span className="landing-brand-word">pocket<span>.</span></span>
        </a>
        <nav className="landing-links" aria-label={t('landing.navAria')}>
          <a href="#features">{t('landing.navFeatures')}</a>
          <a href="#how-it-works">{t('landing.navHow')}</a>
        </nav>
        <div className="landing-nav-actions">
          <LangToggle />
          <Button variant="outline" className="landing-login" onClick={openAuthScreen}>
            <LogIn /> {t('auth.accountCta')}
          </Button>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-copy">
            <div className="landing-eyebrow"><Sparkles /> {t('landing.eyebrow')}</div>
            <h1>{t('landing.heroTitle')} <span>{t('landing.heroHighlight')}</span></h1>
            <p className="landing-lede">{t('landing.heroBody')}</p>
            <div className="landing-actions">
              <Button className="landing-primary" onClick={() => startWithEgp(startGuest)}>
                {t('landing.tryFree')} <ArrowRight className="landing-arrow" />
              </Button>
              <button type="button" className="landing-text-link" onClick={openAuthScreen}>
                {t('landing.haveAccount')} <span>{t('auth.login')}</span>
              </button>
            </div>
            <div className="landing-trust"><ShieldCheck /> {t('landing.noPressure')}</div>
          </div>

          <div className="landing-visual" aria-label={t('landing.previewAria')}>
            <div className="landing-art-spark landing-art-spark-one">✦</div>
            <div className="landing-art-spark landing-art-spark-two">✧</div>
            <div className="landing-sample-card">
              <div className="landing-sample-top"><span>{t('landing.previewLabel')}</span><span className="landing-sample-dots">•••</span></div>
              <div className="landing-sample-balance"><small>EGP</small><strong>2,450</strong><span>{t('landing.sampleBalance')}</span></div>
              <div className="landing-sample-stats">
                <div><span className="landing-stat-icon income">↙</span><small>{t('landing.sampleIncome')}</small><strong>+ 3,200</strong></div>
                <div><span className="landing-stat-icon spending">↗</span><small>{t('landing.sampleSpending')}</small><strong>− 750</strong></div>
              </div>
              <div className="landing-sample-footer"><span className="landing-mini-bars"><i /><i /><i /><i /><i /><i /><i /></span><span>{t('landing.sampleCaption')}</span></div>
            </div>
            <div className="landing-wallet-friend"><WalletFriend /></div>
            <div className="landing-floating-note"><span><TrendingUp /></span><div><strong>{t('landing.floatingTitle')}</strong><small>{t('landing.floatingBody')}</small></div></div>
          </div>
        </section>

        <section className="landing-benefits" id="features">
          <div className="landing-section-heading">
            <span>{t('landing.featuresEyebrow')}</span>
            <h2>{t('landing.featuresTitle')}</h2>
            <p>{t('landing.featuresBody')}</p>
          </div>
          <div className="landing-feature-grid">
            <article className="landing-feature-card feature-green">
              <span className="landing-feature-icon"><WalletCards /></span>
              <h3>{t('landing.featureTrackTitle')}</h3>
              <p>{t('landing.featureTrackBody')}</p>
            </article>
            <article className="landing-feature-card feature-yellow">
              <span className="landing-feature-icon"><ChartNoAxesCombined /></span>
              <h3>{t('landing.featureInvestTitle')}</h3>
              <p>{t('landing.featureInvestBody')}</p>
            </article>
            <article className="landing-feature-card feature-peach">
              <span className="landing-feature-icon"><Languages /></span>
              <h3>{t('landing.featureLangTitle')}</h3>
              <p>{t('landing.featureLangBody')}</p>
            </article>
          </div>
        </section>

        <section className="landing-how" id="how-it-works">
          <div className="landing-how-art"><div className="landing-big-coin">EGP</div><div className="landing-small-coin">✦</div><div className="landing-check-orbit">✓</div></div>
          <div className="landing-how-copy">
            <span>{t('landing.howEyebrow')}</span>
            <h2>{t('landing.howTitle')}</h2>
            <p>{t('landing.howBody')}</p>
            <ul>
              <li><span>✓</span>{t('landing.howPointOne')}</li>
              <li><span>✓</span>{t('landing.howPointTwo')}</li>
              <li><span>✓</span>{t('landing.howPointThree')}</li>
            </ul>
            <Button className="landing-primary" onClick={() => startWithEgp(startGuest)}>
              {t('landing.tryFree')} <ArrowRight className="landing-arrow" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <a className="landing-brand" href={pagePath('/')} aria-label="Pocketjr home"><LogoMark /><span className="landing-brand-word">pocket<span>.</span></span></a>
        <p>{t('landing.footer')}</p>
        <nav className="landing-footer-links" aria-label={ar ? 'روابط الموقع' : 'Website links'}>
          <a href={pagePath('/about')}>{ar ? 'عن Pocketjr' : 'About'}</a>
          <a href={pagePath('/help')}>{ar ? 'المساعدة والأسئلة' : 'Help & FAQ'}</a>
          <a href={pagePath('/guides')}>{ar ? 'دليل المال' : 'Money guides'}</a>
          <a href={pagePath('/privacy-policy')}>{ar ? 'الخصوصية' : 'Privacy'}</a>
          <a href={pagePath('/terms')}>{ar ? 'الشروط' : 'Terms'}</a>
          <a href="mailto:yousefaly147@gmail.com">{ar ? 'تواصل معنا' : 'Contact'}</a>
        </nav>
        <button type="button" onClick={openAuthScreen}>{t('auth.accountCta')}</button>
      </footer>
    </div>
  );
}

