import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

export function LangToggle({ className = '' }: { className?: string }) {
  const { t, lang, setLang } = useI18n();
  return (
    <Button variant="ghost" className={`lang-toggle ${className}`} aria-label={t('lang.switchAria')} title={t('lang.switchAria')} onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
      <Languages /> <span lang={lang === 'ar' ? 'en' : 'ar'}>{t('lang.switchTo')}</span>
    </Button>
  );
}
