import { useQuery } from '@tanstack/react-query';
import { CircleAlert, Coins, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { money } from '@/lib/money-data';

// Real public sources only. If a source fails, that figure shows as unavailable — never a made-up number.
const FX_URL = 'https://open.er-api.com/v6/latest/USD'; // ExchangeRate-API open access (daily)
const GOLD_URL = 'https://api.gold-api.com/price/XAU';   // gold-api.com spot, USD per troy ounce
const TROY_OZ_GRAMS = 31.1034768;
const FX_STALE_MS = 36 * 3600_000;
const GOLD_STALE_MS = 24 * 3600_000;
// The public FX feed refreshes daily; poll hourly to pick up its next published rate.
const FX_REFRESH_MS = 60 * 60_000;
// Gold is a spot-price feed, so re-check it every five minutes while the app is active.
const GOLD_REFRESH_MS = 5 * 60_000;

type Fx = { usdEgp: number; sarEgp: number; updated: string };
type Gold = { usdPerOz: number; updated: string };

async function getJson(url: string): Promise<Record<string, unknown>> {
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Record<string, unknown>;
}

async function fetchFx(): Promise<Fx> {
  const j = await getJson(FX_URL);
  const rates = (j['rates'] ?? {}) as Record<string, unknown>;
  const egp = Number(rates['EGP']); const sar = Number(rates['SAR']);
  const updated = new Date(String(j['time_last_update_utc'] ?? ''));
  if (j['result'] !== 'success' || !(egp > 0) || !(sar > 0) || Number.isNaN(updated.getTime())) throw new Error('Bad FX data');
  return { usdEgp: egp, sarEgp: egp / sar, updated: updated.toISOString() };
}

async function fetchGold(): Promise<Gold> {
  const j = await getJson(GOLD_URL);
  const price = Number(j['price']);
  const updated = new Date(String(j['updatedAt'] ?? ''));
  if (j['symbol'] !== 'XAU' || j['currency'] !== 'USD' || !(price > 0) || Number.isNaN(updated.getTime())) throw new Error('Bad gold data');
  return { usdPerOz: price, updated: updated.toISOString() };
}

export function LiveRates() {
  const i = useI18n();
  const { t } = i;
  const fx = useQuery({ queryKey: ['live-fx'], queryFn: fetchFx, staleTime: 10 * 60_000, refetchInterval: FX_REFRESH_MS, refetchIntervalInBackground: false, retry: 1 });
  const gold = useQuery({ queryKey: ['live-gold'], queryFn: fetchGold, staleTime: 5 * 60_000, refetchInterval: GOLD_REFRESH_MS, refetchIntervalInBackground: false, retry: 1 });
  const when = (iso: string) => i.date(iso, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const isStale = (iso: string, ms: number) => Date.now() - new Date(iso).getTime() > ms;
  const goldEgp = fx.data && gold.data ? (gold.data.usdPerOz * fx.data.usdEgp) / TROY_OZ_GRAMS : null;
  const loading = fx.isPending || gold.isPending;

  const tile = (label: string, value: number | null, updated: string | undefined, staleMs: number, source: string) => (
    <div className="live-tile">
      <span>{label}</span>
      {value === null ? <strong className="live-missing">—</strong> : <strong><span className="num">{money(value)}</span> <small>EGP</small></strong>}
      {updated && value !== null && <small className="live-meta">{t('live.source', { source })} · {t('live.updated', { time: when(updated) })}{isStale(updated, staleMs) && <em className="live-stale">{t('live.stale')}</em>}</small>}
    </div>
  );

  return (
    <section className="panel live-panel" aria-live="polite">
      <div className="panel-header"><h2><Coins className="inline h-5 w-5" /> {t('live.title')}</h2>
        <Button variant="ghost" size="icon" aria-label={t('live.retry')} title={t('live.retry')} disabled={fx.isFetching || gold.isFetching} onClick={() => { void fx.refetch(); void gold.refetch(); }}><RefreshCw /></Button></div>
      {loading ? <p className="live-note">{t('live.loading')}</p> : <>
        <div className="live-grid">
          {tile(t('live.usd'), fx.data?.usdEgp ?? null, fx.data?.updated, FX_STALE_MS, 'ExchangeRate-API')}
          {tile(t('live.sar'), fx.data?.sarEgp ?? null, fx.data?.updated, FX_STALE_MS, 'ExchangeRate-API')}
          {tile(t('live.gold'), goldEgp, gold.data?.updated, GOLD_STALE_MS, 'gold-api.com + ExchangeRate-API')}
        </div>
        {(fx.isError || gold.isError) && <p className="form-error live-error" role="alert"><CircleAlert className="inline h-4 w-4" /> {t('live.unavailable')}</p>}
        <p className="live-note">{t('live.goldNote')} {t('live.note')} <a className="underline" href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">Rates By Exchange Rate API</a></p>
      </>}
    </section>
  );
}
