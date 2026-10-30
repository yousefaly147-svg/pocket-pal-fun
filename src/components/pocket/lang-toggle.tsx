import { Languages } from 'lucide-react';
import { useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

export function LangToggle({ className = '' }: { className?: string }) {
  const { t, lang, setLang } = useI18n();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const switchLanguage = () => {
    const englishPath = pathname.replace(/^\/ar(?=\/|$)/, '') || '/';
    const nextPath = lang === 'ar'
      ? englishPath
      : pathname === '/'
        ? '/ar'
        : `/ar${pathname}`;

    setLang(lang === 'ar' ? 'en' : 'ar');
    window.location.assign(`${nextPath}${window.location.search}${window.location.hash}`);
  };

  return (
    <Button
      variant="ghost"
      className={`lang-toggle ${className}`}
      aria-label={t('lang.switchAria')}
      title={t('lang.switchAria')}
      onClick={switchLanguage}
    >
      <Languages /> <span lang={lang === 'ar' ? 'en' : 'ar'}>{t('lang.switchTo')}</span>
    </Button>
  );
}
