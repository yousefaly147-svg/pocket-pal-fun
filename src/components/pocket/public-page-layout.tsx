import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { LogoMark } from '@/components/cartoon';
import { LangToggle } from './lang-toggle';
import { useI18n } from '@/lib/i18n';

type PublicPageLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function PublicPageLayout({ title, description, children }: PublicPageLayoutProps) {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  const pagePath = (path: string) => ar ? (path === '/' ? '/ar' : `/ar${path}`) : path;
  const labels = ar
    ? { home: 'الرئيسية', about: 'عن Pocketjr', help: 'المساعدة والأسئلة', guides: 'دليل المال', privacy: 'الخصوصية', terms: 'الشروط', contact: 'تواصل معنا', eyebrow: 'موارد Pocketjr' }
    : { home: 'Home', about: 'About', help: 'Help & FAQ', guides: 'Money guides', privacy: 'Privacy', terms: 'Terms', contact: 'Contact', eyebrow: 'Pocketjr resources' };

  return (
    <main className="public-content" dir={ar ? 'rtl' : 'ltr'}>
      <header className="public-content-header">
        <Link to={pagePath('/')} className="landing-brand" aria-label="Pocketjr home">
          <LogoMark />
          <span className="landing-brand-word">pocket<span>.</span></span>
        </Link>
        <nav className="public-content-nav" aria-label={ar ? 'التنقل' : 'Public navigation'}>
          <Link to={pagePath('/')}>{labels.home}</Link>
          <Link to={pagePath('/about')}>{labels.about}</Link>
          <Link to={pagePath('/help')}>{labels.help}</Link>
          <Link to={pagePath('/guides')}>{labels.guides}</Link>
          <LangToggle />
        </nav>
      </header>

      <article className="public-content-card">
        <p className="public-content-eyebrow">{labels.eyebrow}</p>
        <h1>{title}</h1>
        <p className="public-content-description">{description}</p>
        <div className="public-content-body">{children}</div>
      </article>

      <footer className="public-content-footer">
        <Link to={pagePath('/')}>{labels.home}</Link>
        <Link to={pagePath('/about')}>{labels.about}</Link>
        <Link to={pagePath('/help')}>{labels.help}</Link>
        <Link to={pagePath('/guides')}>{labels.guides}</Link>
        <Link to={pagePath('/privacy-policy')}>{labels.privacy}</Link>
        <Link to={pagePath('/terms')}>{labels.terms}</Link>
        <a href="mailto:yousefaly147@gmail.com">{labels.contact}</a>
      </footer>
  </main>
  );
}
