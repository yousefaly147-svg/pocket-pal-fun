import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowDownLeft, ArrowUpRight, ArrowRight, Bell, LayoutDashboard, ReceiptText, ChartPie, Flag, Settings, ChevronDown, CalendarDays,
  Utensils, CarFront, ShoppingBag, Music2, Ellipsis, Plus, Eye, EyeOff, TrendingDown, TrendingUp, Lightbulb, Heart, ShieldCheck, CircleHelp,
  Sparkles, Check, Search, Banknote, Target, Hand, UserRound, Sun, Receipt, GraduationCap, HeartPulse, Gift, Trophy, PiggyBank, Trash2,
  LogIn, LogOut, RefreshCw, Smartphone, CircleAlert, ChevronLeft, ChevronRight, type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { WalletFriend, GoalFriend, LogoMark } from '@/components/cartoon';
import { api, ApiError, type InvKind, type MoneyData, type Transaction, type TxType } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { CURRENCIES, useDevicePrefs } from '@/lib/device-prefs';
import { LiveRates } from './live-rates';
import { cashBalance, currentMonthKey, dayKeyOf, daySummary, shiftDay, monthKeyOf, monthOptions, monthTotals, portfolio, previousMonthKey, spendingByCategory } from '@/lib/finance';
import { useI18n, type TKey } from '@/lib/i18n';
import { categorySlug, expenseCategories, incomeCategories, INVESTMENT_CATEGORY } from '@/lib/money-data';
import { LangToggle } from './lang-toggle';
import { CartesianGrid, Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type View = 'Dashboard' | 'Transactions' | 'Budgets' | 'Goals' | 'Investments' | 'Settings';
type Modal = 'income' | 'expense' | 'invest' | 'budget' | 'goal' | 'goalEdit' | 'notifications' | 'help' | null;
const navItems: { name: View; icon: LucideIcon }[] = [
  { name: 'Dashboard', icon: LayoutDashboard }, { name: 'Transactions', icon: ReceiptText }, { name: 'Budgets', icon: ChartPie },
  { name: 'Goals', icon: Flag }, { name: 'Investments', icon: TrendingUp }, { name: 'Settings', icon: Settings },
];
const categoryIcons: Record<string, LucideIcon> = {
  Food: Utensils, Transport: CarFront, Shopping: ShoppingBag, Entertainment: Music2, Bills: Receipt, Education: GraduationCap,
  Health: HeartPulse, Other: Ellipsis, Salary: Banknote, Gift: Gift, Winnings: Trophy, Investment: PiggyBank,
};
const MAX_AMOUNT = 100_000_000;

/** Keeps numbers left-to-right inside Arabic text. */
function Num({ children }: { children: React.ReactNode }) { return <span className="num">{children}</span>; }

function CategoryIcon({ category }: { category: string }) {
  const Icon = categoryIcons[category] ?? Ellipsis;
  return <span className={`category-icon category-${categorySlug(category)}`}><Icon /></span>;
}

export function Dashboard() {
  const i = useI18n();
  const { t } = i;
  const cur = i.currency;
  const { session, logout, openAuthScreen, changeUsername } = useAuth();
  // Android-only notice (iOS/desktop: hidden). Detected after mount to avoid hydration mismatch.
  const [isAndroid, setIsAndroid] = useState(false);
  useEffect(() => { setIsAndroid(/Android/i.test(navigator.userAgent)); }, []);
  const token = session!.token;
  const userId = session!.userId;
  const queryClient = useQueryClient();
  const queryKey = ['pocket-data', userId];
  const query = useQuery({
    queryKey,
    queryFn: () => api.getData(token),
    retry: (count, err) => !(err instanceof ApiError && (err.code === 'unauthorized' || err.code === 'invalidInput')) && count < 1,
    staleTime: 30_000,
  });
  const { prefs, loaded: prefsLoaded, update: updatePrefs, clear: clearPrefs } = useDevicePrefs(userId);
  const { setCurrency } = i;
  useEffect(() => { setCurrency(prefs.currency ?? 'EGP'); }, [prefs.currency, setCurrency]);
  useEffect(() => () => setCurrency('EGP'), [setCurrency]);
  const [day, setDay] = useState('');

  const [view, setView] = useState<View>('Dashboard');
  const [month, setMonth] = useState(() => currentMonthKey());
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Modal>(null);
  const [investKind, setInvestKind] = useState<InvKind>('added');
  const [hidden, setHidden] = useState(false);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [chartMode, setChartMode] = useState<'amount' | 'percent'>('amount');
  const [usernameDraft, setUsernameDraft] = useState(session?.username ?? '');
  const [usernameBusy, setUsernameBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => { const n = new Date(); setNow(n); setDay(dayKeyOf(n.toISOString())); }, []);
  useEffect(() => { setUsernameDraft(session?.username ?? ''); }, [session?.username]);
  const todayKey = now ? dayKeyOf(now.toISOString()) : '';
  const [pickedDate, setPickedDate] = useState('');
  useEffect(() => { setPickedDate(todayKey); }, [modal, todayKey]);
  useEffect(() => { setFormError(''); }, [modal]);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(null), 4000); return () => clearTimeout(id); }, [toast]);
  useEffect(() => {
    if (!query.isPending) { setSlow(false); return; }
    const id = setTimeout(() => setSlow(true), 5000);
    return () => clearTimeout(id);
  }, [query.isPending]);
  useEffect(() => {
    if (query.error instanceof ApiError && query.error.code === 'unauthorized') logout('sessionExpired');
  }, [query.error, logout]);

  const data: MoneyData = query.data ?? { transactions: [], investments: [] };
  const txs = data.transactions;
  const invs = data.investments;
  const months = useMemo(() => monthOptions(txs, invs), [txs, invs]);
  const totals = useMemo(() => monthTotals(txs, month), [txs, month]);
  const prevTotals = useMemo(() => monthTotals(txs, previousMonthKey(month)), [txs, month]);
  const byCategory = useMemo(() => spendingByCategory(txs, month), [txs, month]);
  const balance = useMemo(() => cashBalance(txs), [txs]);
  const folio = useMemo(() => portfolio(invs), [invs]);
  const investmentHistory = useMemo(() => {
    const ordered = [...invs].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const firstDeposit = ordered.findIndex(item => item.kind === 'added');
    if (firstDeposit < 0) return [];
    let value = 0;
    return ordered.slice(firstDeposit).map(item => {
      value += item.kind === 'loss' ? -item.amount : item.amount;
      return {
        date: i.date(item.createdAt, { day: 'numeric', month: 'short' }),
        fullDate: i.date(item.createdAt, { day: 'numeric', month: 'long', year: 'numeric' }),
        value: Math.round(value * 100) / 100,
      };
    });
  }, [invs, i.date, i.lang]);
  const spent = totals.spending;
  const budget = prefs.budget;
  const goal = prefs.goal;
  const goalPct = goal ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0;

  const monthTxs = txs.filter(x => monthKeyOf(x.createdAt) === month);
  const q = search.trim().toLowerCase();
  const visibleTxs = monthTxs.filter(x => (filter === 'all' || x.category === filter)
    && (!q || x.description.toLowerCase().includes(q) || i.category(x.category).toLowerCase().includes(q) || x.category.toLowerCase().includes(q)));
  const usedCategories = Array.from(new Set(txs.map(x => x.category)));

  const setData = (fn: (d: MoneyData) => MoneyData) => queryClient.setQueryData<MoneyData>(queryKey, d => (d ? fn(d) : d));
  const show = (text: string, error = false) => setToast({ text, error });
  function errorText(err: unknown) {
    const code = err instanceof ApiError ? err.code : 'unknown';
    return t(`err.${code}` as TKey);
  }
  function handleError(err: unknown, asToast = false) {
    if (err instanceof ApiError && err.code === 'unauthorized') { logout('sessionExpired'); return; }
    if (asToast) show(errorText(err), true); else setFormError(errorText(err));
  }
  function relDate(iso: string) {
    const k = iso.slice(0, 10);
    if (now) {
      const today = new Date(now); const y = new Date(now); y.setDate(y.getDate() - 1);
      const local = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const d = new Date(iso); const dk = Number.isNaN(d.getTime()) ? k : local(d);
      if (dk === local(today)) return t('tx.today');
      if (dk === local(y)) return t('tx.yesterday');
    }
    return i.date(iso, { day: 'numeric', month: 'short' });
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    const rawAmount = Number(String(fd.get('amount') ?? '').replace(/,/g, ''));
    if (!Number.isFinite(rawAmount) || rawAmount <= 0) return setFormError(t('err.amount'));
    if (rawAmount > MAX_AMOUNT) return setFormError(t('err.amountMax'));
    const amount = Math.round(rawAmount * 100) / 100;

    if (modal === 'budget') { updatePrefs({ budget: amount }); show(t('toast.budget')); setModal(null); return; }
    if (modal === 'goalEdit') {
      const name = String(fd.get('goalName') ?? '').trim();
      if (!name) return setFormError(t('err.goalName'));
      updatePrefs({ goal: { name, target: amount, saved: goal?.saved ?? 0 } }); show(t('toast.goalSaved')); setModal(null); return;
    }
    if (modal === 'goal') {
      if (!goal) return;
      updatePrefs({ goal: { ...goal, saved: Math.round((goal.saved + amount) * 100) / 100 } });
      show(t('toast.goal', { amount: i.money(amount) })); setModal(null); return;
    }

    setBusy(true); setFormError('');
    try {
      if (modal === 'income' || modal === 'expense') {
        const description = String(fd.get('description') ?? '').trim(); // optional, saved exactly as typed
        const chosen = String(fd.get('date') ?? '') || todayKey;
        if (todayKey && chosen > todayKey) { setFormError(t('form.dateFuture')); return; }
        const [y = 1970, m = 1, dd = 1] = chosen.split('-').map(Number);
        const created_at = chosen === todayKey ? new Date().toISOString() : new Date(y, m - 1, dd, 12).toISOString();
        const type: TxType = modal;
        const saved = await api.addTransaction(token, { type, amount, category: String(fd.get('category') ?? 'Other'), description, created_at });
        setData(d => ({ ...d, transactions: [saved, ...d.transactions] }));
        setMonth(monthKeyOf(saved.createdAt) || currentMonthKey());
        setDay(dayKeyOf(saved.createdAt) || todayKey);
        show(dayKeyOf(saved.createdAt) !== chosen ? t('toast.dateIgnored') : t(modal === 'income' ? 'toast.income' : 'toast.expense'), dayKeyOf(saved.createdAt) !== chosen);
      } else if (modal === 'invest') {
        const kind = String(fd.get('kind') ?? 'added') as InvKind;
        const note = String(fd.get('note') ?? '').trim();
        if (kind === 'added' && amount > balance) { setFormError(t('err.overBalance', { amount: i.money(Math.max(0, balance)) })); return; }
        const chosen = String(fd.get('date') ?? '') || todayKey;
        if (todayKey && chosen > todayKey) { setFormError(t('form.dateFuture')); return; }
        const [y = 1970, m = 1, dd = 1] = chosen.split('-').map(Number);
        const created_at = chosen === todayKey ? new Date().toISOString() : new Date(y, m - 1, dd, 12).toISOString();
        const inv = await api.addInvestment(token, { kind, amount, note, created_at });
        let expense: Transaction | null = null;
        if (kind === 'added') {
          try {
            expense = await api.addTransaction(token, { type: 'expense', amount, category: INVESTMENT_CATEGORY, description: note || INVESTMENT_CATEGORY, created_at: inv.createdAt });
          } catch (err) {
            if (err instanceof ApiError && err.code === 'unauthorized') throw err;
            try { await api.deleteInvestment(token, inv.id); setFormError(t('err.investRollback')); }
            catch { setData(d => ({ ...d, investments: [inv, ...d.investments] })); setFormError(t('err.investPartial')); }
            return;
          }
        }
        setData(d => ({ investments: [inv, ...d.investments], transactions: expense ? [expense, ...d.transactions] : d.transactions }));
        setMonth(monthKeyOf(inv.createdAt) || currentMonthKey());
        setDay(dayKeyOf(inv.createdAt) || todayKey);
        const dateWasIgnored = dayKeyOf(inv.createdAt) !== chosen;
        show(dateWasIgnored ? t('toast.dateIgnored') : t('toast.invest'), dateWasIgnored);
      }
      setModal(null);
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }

  async function deleteTx(tx: Transaction) {
    if (!window.confirm(t('tx.confirmDelete'))) return;
    setDeleting(tx.id);
    try { await api.deleteTransaction(token, tx.id); setData(d => ({ ...d, transactions: d.transactions.filter(x => x.id !== tx.id) })); show(t('tx.deleted')); }
    catch (err) { handleError(err, true); }
    finally { setDeleting(null); }
  }
  async function deleteInv(id: string, kind: InvKind) {
    if (!window.confirm(t('inv.confirmDelete') + (kind === 'added' ? `\n\n${t('inv.deleteAddedNote')}` : ''))) return;
    setDeleting(`inv-${id}`);
    try { await api.deleteInvestment(token, id); setData(d => ({ ...d, investments: d.investments.filter(x => x.id !== id) })); show(t('inv.deleted')); }
    catch (err) { handleError(err, true); }
    finally { setDeleting(null); }
  }
  function openInvest(kind: InvKind) { setInvestKind(kind); setModal('invest'); }

  async function saveUsername() {
    const value = usernameDraft.trim();
    if (!/^[A-Za-z0-9_.-]{3,20}$/.test(value)) {
      show(t('err.usernameFormat'), true);
      return;
    }
    setUsernameBusy(true);
    try {
      await changeUsername(value);
      setUsernameDraft(value);
      show(t('settings.usernameSaved'));
    } catch (err) {
      show(errorText(err), true);
    } finally {
      setUsernameBusy(false);
    }
  }

  // ---------- Loading / error ----------
  if (query.isPending || !prefsLoaded) {
    return <div className="state-screen" role="status" aria-live="polite"><LogoMark /><div className="state-spinner" aria-hidden="true" /><h1>{t('load.title')}</h1>{slow && <p>{t('load.waking')}</p>}</div>;
  }
  if (query.isError) {
    return <div className="state-screen" role="alert"><CircleAlert className="state-icon" /><h1>{t('load.errorTitle')}</h1><p>{errorText(query.error)}</p><div className="state-actions"><Button onClick={() => void query.refetch()}><RefreshCw /> {t('load.retry')}</Button><Button variant="outline" onClick={() => logout()}><LogOut /> {t('settings.logout')}</Button></div><LangToggle /></div>;
  }

  // ---------- Pieces ----------
  const deviceBadge = <span className="device-badge"><Smartphone /> {t('device.only')}</span>;
  const spendCompare = prevTotals.spending > 0 && spent > 0 ? Math.round(((spent - prevTotals.spending) / prevTotals.spending) * 100) : null;

  const transactionsPanel = (full: boolean) => (
    <section className="panel transactions-panel">
      <div className="panel-header">
        <h2>{full ? t('tx.all') : t('tx.recent')}</h2>
        {full
          ? <select className="tiny-select" aria-label={t('tx.filterAria')} value={filter} onChange={e => setFilter(e.target.value)}><option value="all">{t('tx.allCategories')}</option>{usedCategories.map(c => <option key={c} value={c}>{i.category(c)}</option>)}</select>
          : <Button variant="text" onClick={() => setView('Transactions')}>{t('tx.viewAll')} <ArrowRight className="flip-rtl" /></Button>}
      </div>
      <div className={`transaction-head ${full ? 'with-action' : ''}`}><span>{t('tx.colTx')}</span><span>{t('tx.colDate')}</span><span>{t('tx.colAmount')}</span>{full && <span />}</div>
      {(full ? visibleTxs : monthTxs.slice(0, 5)).map(x => (
        <div className={`transaction-row ${full ? 'with-action' : ''}`} key={x.id}>
          <div className="transaction-merchant"><CategoryIcon category={x.category} /><div className="transaction-name"><strong dir="auto">{x.description || t('tx.noDescription')}</strong><small>{x.type === 'income' ? `${t('tx.income')} · ${i.category(x.category)}` : i.category(x.category)}</small></div></div>
          <span className="transaction-date">{relDate(x.createdAt)}</span>
          <span className={`transaction-amount ${x.type === 'income' ? 'positive' : ''}`}><Num>{x.type === 'income' ? '+' : '−'}{i.money(x.amount)}</Num><small>{cur}</small></span>
          {full && <Button variant="ghost" size="icon" className="row-delete" disabled={deleting === x.id} aria-label={t('tx.deleteAria', { name: x.description || i.category(x.category) })} title={t('tx.deleteAria', { name: x.description || i.category(x.category) })} onClick={() => void deleteTx(x)}><Trash2 /></Button>}
        </div>
      ))}
      {(full ? visibleTxs : monthTxs).length === 0 && <div className="empty-state">{full && monthTxs.length > 0 ? t('tx.noMatch') : t('tx.empty')}</div>}
    </section>
  );

  const budgetCard = (
    <section className="panel budget-panel">
      <div className="panel-header"><div><h2>{t('budget.title')}</h2>{deviceBadge}</div><Button variant="ghost" size="icon" className="h-6 w-6" aria-label={t('budget.edit')} title={t('budget.edit')} onClick={() => setModal('budget')}><Ellipsis /></Button></div>
      {budget ? <>
        <div className="budget-amount"><span>{cur}</span> <Num>{i.wholeMoney(spent)}</Num> <small>/ <Num>{i.wholeMoney(budget)}</Num></small></div>
        <p className="budget-sub">{t('budget.sub')}</p>
        <div className="progress-track budget-progress"><progress value={Math.min(spent, budget)} max={budget} aria-label={t('budget.title')} /></div>
        <div className="progress-labels"><strong>{t('budget.spent', { pct: Math.round((spent / budget) * 100) })}</strong><span>{t('budget.left', { pct: Math.max(0, Math.round(100 - (spent / budget) * 100)) })}</span></div>
        <div className="budget-note"><Sparkles /><span>{spent <= budget ? t('budget.happy') : t('budget.over')}</span></div>
        <div className="budget-divider" />
        <div className="budget-bottom"><span>{t('budget.leftToSpend')}</span><strong>{cur} <Num>{i.money(Math.max(0, budget - spent))}</Num></strong></div>
      </> : <div className="empty-block"><p>{t('budget.none')}</p><Button variant="outline" onClick={() => setModal('budget')}><Plus /> {t('budget.set')}</Button></div>}
    </section>
  );

  const goalCard = (
    <section className="panel goal-panel">
      <div className="panel-header"><div><h2>{t('goal.title')}</h2>{deviceBadge}</div>{goal ? <Button variant="ghost" size="icon" className="h-6 w-6" aria-label={t('goal.edit')} title={t('goal.edit')} onClick={() => setModal('goalEdit')}><Ellipsis /></Button> : <Flag className="h-4 w-4 text-muted-foreground" />}</div>
      <GoalFriend />
      {goal ? <>
        <h3 className="goal-title"><span dir="auto">{goal.name}</span> <Sun className="goal-title-sun" /></h3>
        <div className="goal-saved">{cur} <Num>{i.wholeMoney(goal.saved)}</Num> <span>{t('goal.ofTarget', { target: i.wholeMoney(goal.target) })}</span></div>
        <div className="progress-track"><progress value={Math.min(goal.saved, goal.target)} max={goal.target} aria-label={t('goal.progressAria')} /></div>
        <div className="progress-labels"><strong>{t('goal.there', { pct: goalPct })}</strong><span>{goal.saved < goal.target ? t('goal.closer') : t('goal.done')}</span></div>
        <Button className="goal-add" onClick={() => setModal('goal')}><Plus /> {t('goal.add')}</Button>
      </> : <>
        <h3 className="goal-title">{t('goal.none')}</h3><p className="goal-sub">{t('goal.noneSub')}</p>
        <Button className="goal-add" onClick={() => setModal('goalEdit')}><Plus /> {t('goal.create')}</Button>
      </>}
    </section>
  );

  const dayInfo = day ? daySummary(txs, day) : null;
  const dayPanel = dayInfo && (
    <section className="panel day-panel">
      <div className="panel-header"><h2><CalendarDays className="inline h-5 w-5" /> {t('day.title')}</h2>
        <div className="day-nav">
          <Button variant="ghost" size="icon" aria-label={t('day.prev')} title={t('day.prev')} onClick={() => setDay(shiftDay(day, -1))}><ChevronLeft className="flip-rtl" /></Button>
          <input type="date" aria-label={t('day.pick')} value={day} max={todayKey} dir="ltr" onChange={e => e.target.value && setDay(e.target.value)} />
          <Button variant="ghost" size="icon" aria-label={t('day.next')} title={t('day.next')} disabled={day >= todayKey} onClick={() => setDay(shiftDay(day, 1))}><ChevronRight className="flip-rtl" /></Button>
        </div></div>
      <p className="day-label">{i.date(`${day}T12:00:00`, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <div className="day-stats">
        <div><span>{t('day.income')}</span><strong className="positive">{cur} <Num>+{i.money(dayInfo.income)}</Num></strong></div>
        <div><span>{t('day.spending')}</span><strong>{cur} <Num>−{i.money(dayInfo.spending)}</Num></strong></div>
        {dayInfo.invested > 0 && <div><span>{t('day.invested')}</span><strong>{cur} <Num>−{i.money(dayInfo.invested)}</Num></strong></div>}
        <div><span>{t('day.net')}</span><strong className={dayInfo.net >= 0 ? 'positive' : 'negative'}>{cur} <Num>{dayInfo.net >= 0 ? '+' : '−'}{i.money(Math.abs(dayInfo.net))}</Num></strong></div>
      </div>
      {dayInfo.items.length === 0 ? <div className="empty-state">{t('day.empty')}</div> : dayInfo.items.map(x => (
        <div className="transaction-row" key={x.id}>
          <div className="transaction-merchant"><CategoryIcon category={x.category} /><div className="transaction-name"><strong dir="auto">{x.description || t('tx.noDescription')}</strong><small>{i.category(x.category)}</small></div></div>
          <span className="transaction-date">{i.date(x.createdAt, { hour: '2-digit', minute: '2-digit' })}</span>
          <span className={`transaction-amount ${x.type === 'income' ? 'positive' : ''}`}><Num>{x.type === 'income' ? '+' : '−'}{i.money(x.amount)}</Num><small>{cur}</small></span>
        </div>
      ))}
    </section>
  );

  const biggest = byCategory[0];
  const circumference = 2 * Math.PI * 76;

  const subKey = `sub.${view}` as TKey;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><LogoMark /><span className="brand-word">pocket<span className="brand-dot">.</span></span></div>
        <p className="brand-caption">{t('app.tagline')}</p>
        <div className="nav-caption">{t('nav.caption')}</div>
        <nav className="nav-items" aria-label={t('nav.aria')}>
          {navItems.map(item => <Button key={item.name} variant="nav" className={view === item.name ? 'active' : ''} aria-current={view === item.name ? 'page' : undefined} onClick={() => { setView(item.name); setFilter('all'); setSearch(''); }}><item.icon /><span className="nav-label">{t(`nav.${item.name}` as TKey)}</span></Button>)}
        </nav>
        <div className="side-bottom">
          <div className="side-note"><Heart className="note-icon" /><h3>{t('side.noteTitle')}</h3><p>{t('side.noteBody')}</p></div>
          <Button variant="ghost" className="help-button" onClick={() => setModal('help')}><CircleHelp /> {t('side.help')}</Button>
          <p className="side-footer">{t('side.footer')}</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span className="mobile-logo"><LogoMark /></span><span className="breadcrumb-desktop">{t('top.breadcrumb')} &nbsp; / &nbsp; </span><span className="breadcrumb-desktop">{t(`nav.${view}` as TKey)}</span><span className="mobile-logo">pocket.</span></div>
          <div className="topbar-right">
            {now && <span className="top-date">{i.date(now.toISOString(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>}
            <LangToggle />
            <Button variant="ghost" size="icon" className="notification-button" aria-label={t('top.notifications')} title={t('top.notifications')} onClick={() => setModal('notifications')}><Bell /></Button>
            {session!.guest
              ? <Button variant="ghost" className="profile-button guest-profile-button" onClick={openAuthScreen} aria-label={t('auth.accountCta')}><span className="avatar"><LogIn /></span><span className="profile-name">{t('auth.accountCta')}</span></Button>
              : <Button variant="ghost" className="profile-button" onClick={() => setView('Settings')} aria-label={t('top.profile')}><span className="avatar"><UserRound /></span><span className="profile-name" dir="ltr">{session!.username || session!.email.split('@')[0]}</span><ChevronDown className="h-3 w-3" /></Button>}
          </div>
        </header>

        {session!.guest && <p className="guest-mode-notice">{t('guest.localNotice')}</p>}
        <div className="greeting-row">
          <div className="min-w-0"><h1>{view === 'Dashboard' ? t('greet.hello') : t(`nav.${view}` as TKey)} {view === 'Dashboard' && <Hand className="greeting-wave" />}</h1><p>{t(subKey)}</p></div>
          {view !== 'Settings' && view !== 'Investments' && <div className="select-wrap"><CalendarDays /><select className="period-select" aria-label={t('period.aria')} value={month} onChange={e => setMonth(e.target.value)}>{months.map(m => <option key={m} value={m}>{i.month(m)}</option>)}</select><ChevronDown /></div>}
        </div>

        {view === 'Dashboard' && <div className="dashboard-grid">
          <div className="left-column">
            <section className="panel balance-card">
              <div className="balance-label">{t('balance.total')} <Button variant="ghost" className="h-6 w-6 p-0" aria-label={hidden ? t('balance.show') : t('balance.hide')} title={hidden ? t('balance.show') : t('balance.hide')} onClick={() => setHidden(!hidden)}>{hidden ? <EyeOff /> : <Eye />}</Button></div>
              <div className="balance-amount"><small>{cur}</small><Num>{hidden ? '••••••' : `${balance < 0 ? '−' : ''}${i.money(Math.abs(balance))}`}</Num></div>
              <div className="balance-caption">{t('balance.caption')}</div>
              <div className="balance-stats">
                <div className="balance-stat"><div className="stat-icon"><ArrowDownLeft /></div><div><span>{t('balance.income')}</span><strong>{hidden ? '••••' : <>{cur} <Num>+{i.money(totals.income)}</Num></>}</strong></div></div>
                <div className="balance-stat"><div className="stat-icon"><ArrowUpRight /></div><div><span>{t('balance.expenses')}</span><strong>{hidden ? '••••' : <>{cur} <Num>−{i.money(spent)}</Num></>}</strong></div></div>
                {totals.invested > 0 && <div className="balance-stat"><div className="stat-icon"><PiggyBank /></div><div><span>{t('balance.invested')}</span><strong>{hidden ? '••••' : <>{cur} <Num>{i.money(totals.invested)}</Num></>}</strong></div></div>}
              </div>
              <WalletFriend />
            </section>
            <div className="quick-actions">
              <Button variant="quick" onClick={() => setModal('income')}><span className="quick-icon"><Plus /></span>{t('quick.income')}</Button>
              <Button variant="quick" onClick={() => setModal('expense')}><span className="quick-icon"><ArrowUpRight /></span>{t('quick.expense')}</Button>
              <Button variant="quick" onClick={() => openInvest('added')}><span className="quick-icon"><TrendingUp /></span>{t('quick.invest')}</Button>
            </div>

            <section className="panel spending-panel">
              <div className="panel-header"><h2>{t('spend.title')}</h2><select className="tiny-select" aria-label={t('spend.aria')} value={chartMode} onChange={e => setChartMode(e.target.value as 'amount' | 'percent')}><option value="amount">{t('spend.byAmount')}</option><option value="percent">{t('spend.byPercent')}</option></select></div>
              {spent > 0 ? <div className="spending-body">
                <div className="donut" role="img" aria-label={t('spend.chartAria', { amount: i.money(spent) })}>
                  <svg viewBox="0 0 200 200"><circle className="donut-track" cx="100" cy="100" r="76" />{byCategory.map((c, idx) => {
                    const length = (c.amount / spent) * circumference;
                    const offset = byCategory.slice(0, idx).reduce((s, k) => s + (k.amount / spent) * circumference, 0);
                    const visible = byCategory.length > 1 ? Math.max(0, length - 5) : length;
                    return <circle key={c.category} className={`donut-seg category-${categorySlug(c.category)}`} cx="100" cy="100" r="76" strokeDasharray={`${visible} ${circumference - visible}`} strokeDashoffset={-offset} strokeLinecap={byCategory.length > 1 ? 'round' : 'butt'} />;
                  })}</svg>
                  <div className="donut-center"><span>{t('spend.total')}</span><strong><Num>{i.wholeMoney(spent)}</Num></strong><small>{t('spend.thisMonth')}</small></div>
                </div>
                <div className="category-legend">{byCategory.map(c => <div className={`category-row category-${categorySlug(c.category)}`} key={c.category}><span className="category-dot" /><span>{i.category(c.category)}</span><strong><Num>{chartMode === 'percent' ? `${Math.round((c.amount / spent) * 100)}%` : i.wholeMoney(c.amount)}</Num>{chartMode === 'amount' && <small>{cur}</small>}</strong></div>)}</div>
              </div> : <div className="empty-state">{t('spend.empty')}</div>}
              <div className="spending-foot">
                {spendCompare === null ? <><Sparkles /><span>{t('spend.noCompare')}</span></>
                  : Math.abs(spendCompare) < 2 ? <><Sparkles /><span>{t('spend.same')}</span></>
                  : spendCompare < 0 ? <><TrendingDown /><strong>{t('spend.less', { pct: Math.abs(spendCompare) })}</strong><span>{t('spend.lessTail')}</span></>
                  : <><TrendingUp className="trend-up" /><strong className="trend-up">{t('spend.more', { pct: spendCompare })}</strong><span>{t('spend.moreTail')}</span></>}
              </div>
            </section>
            {transactionsPanel(false)}
          </div>
          <div className="right-column">
            {budgetCard}
            {goalCard}
            <section className="panel insight-panel"><div className="insight-heading"><Lightbulb /><h3>{t('insight.title')}</h3></div><p>{biggest ? t('insight.biggest', { category: i.category(biggest.category), amount: i.money(biggest.amount) }) : t('insight.empty')}</p></section>
          </div>
        </div>}

        {view === 'Transactions' && <div className="full-view">
          <div className="view-toolbar"><div className="search-field"><Search /><input aria-label={t('tx.searchAria')} placeholder={t('tx.search')} value={search} onChange={e => setSearch(e.target.value)} dir="auto" /></div><div className="toolbar-actions"><Button variant="outline" onClick={() => setModal('income')}><Plus /> {t('quick.income')}</Button><Button onClick={() => setModal('expense')}><Plus /> {t('tx.add')}</Button></div></div>
          {dayPanel}
          {transactionsPanel(true)}
        </div>}

        {view === 'Budgets' && <div className="full-view">
          {budgetCard}
          <h2 className="section-title">{t('budget.byCategory')}</h2>
          {byCategory.length === 0 ? <div className="panel empty-state">{t('budget.categoryEmpty')}</div> : <div className="budget-categories">{byCategory.map(c => (
            <section className={`panel category-budget category-${categorySlug(c.category)}`} key={c.category}>
              <CategoryIcon category={c.category} /><h3>{i.category(c.category)}</h3>
              <p>{cur} <Num>{i.money(c.amount)}</Num> · {t('budget.ofTotal', { pct: Math.round((c.amount / spent) * 100) })}</p>
              <div className="progress-track"><progress value={c.amount} max={spent} aria-label={i.category(c.category)} /></div>
            </section>
          ))}</div>}
        </div>}

        {view === 'Goals' && <div className="goal-view-grid">
          {goalCard}
          <section className="panel"><div className="panel-header"><h2>{t('goal.next')}</h2><Target className="h-5 w-5 text-primary" /></div>
            <p className="text-sm leading-7 text-muted-foreground">{!goal ? t('goal.noneSub') : goal.saved >= goal.target ? t('goal.reached') : t('goal.toGo', { amount: i.money(goal.target - goal.saved) })}</p>
            <p className="device-note"><Smartphone /> {t('goal.deviceNote')}</p>
            <Button variant="outline" className="mt-5" onClick={() => setModal(goal ? 'goal' : 'goalEdit')}><Plus /> {goal ? t('goal.progress') : t('goal.create')}</Button>
          </section>
        </div>}

        {view === 'Investments' && <div className="full-view">
          <div className="inv-stats">
            <section className="panel inv-stat inv-value"><span>{t('inv.value')}</span><strong>{cur} <Num>{i.money(folio.value)}</Num></strong></section>
            <section className="panel inv-stat"><span>{t('inv.added')}</span><strong><Num>{i.money(folio.added)}</Num></strong></section>
            <section className="panel inv-stat"><span>{t('inv.gains')}</span><strong className="positive"><Num>+{i.money(folio.gains)}</Num></strong></section>
            <section className="panel inv-stat"><span>{t('inv.losses')}</span><strong className="negative"><Num>−{i.money(folio.losses)}</Num></strong></section>
          </div>
          <section className="panel investment-chart-panel">
            <div className="panel-header"><div><h2>{t('inv.chartTitle')}</h2><p className="investment-chart-description">{t('inv.chartDesc')}</p></div></div>
            {investmentHistory.length === 0
              ? <div className="investment-chart-empty">{t('inv.chartEmpty')}</div>
              : <div className="investment-chart-wrap">
                  <ResponsiveContainer width="100%" height={260}>
                    <RechartsLineChart data={investmentHistory} margin={{ top: 10, right: 14, bottom: 4, left: 4 }}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} minTickGap={24} />
                      <YAxis width={82} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={value => i.money(Number(value))} />
                      <Tooltip
                        labelFormatter={label => String(label)}
                        formatter={value => [`${cur} ${i.money(Number(value ?? 0))}`, t('inv.value')]}
                        contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: 12, color: 'var(--foreground)' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>}
          </section>
          <LiveRates />
          <p className="device-note inv-explain"><Lightbulb /> {t('inv.explain')}</p>
          <div className="toolbar-actions inv-actions"><Button onClick={() => openInvest('added')}><Plus /> {t('inv.addMoney')}</Button><Button variant="outline" onClick={() => openInvest('gain')}><TrendingUp /> {t('inv.addGain')}</Button><Button variant="outline" onClick={() => openInvest('loss')}><TrendingDown /> {t('inv.addLoss')}</Button></div>
          <section className="panel transactions-panel">
            <div className="panel-header"><h2>{t('inv.list')}</h2></div>
            {invs.map(x => (
              <div className="transaction-row with-action" key={x.id}>
                <div className="transaction-merchant"><span className={`category-icon inv-${x.kind}`}>{x.kind === 'added' ? <PiggyBank /> : x.kind === 'gain' ? <TrendingUp /> : <TrendingDown />}</span><div className="transaction-name"><strong>{t(`inv.kind.${x.kind}` as TKey)}</strong>{x.note && <small dir="auto">{x.note}</small>}</div></div>
                <span className="transaction-date">{relDate(x.createdAt)}</span>
                <span className={`transaction-amount ${x.kind === 'loss' ? '' : 'positive'}`}><Num>{x.kind === 'loss' ? '−' : '+'}{i.money(x.amount)}</Num><small>{cur}</small></span>
                <Button variant="ghost" size="icon" className="row-delete" disabled={deleting === `inv-${x.id}`} aria-label={t('inv.deleteAria')} title={t('inv.deleteAria')} onClick={() => void deleteInv(x.id, x.kind)}><Trash2 /></Button>
              </div>
            ))}
            {invs.length === 0 && <div className="empty-state">{t('inv.empty')}</div>}
          </section>
        </div>}

        {view === 'Settings' && <div className="settings-stack">
          <section className="panel settings-panel">
            <h2 className="settings-title">{t('settings.title')}</h2>
            <div className="form-grid">
              <label className="field full">{t('settings.language')}<select value={i.lang} onChange={e => i.setLang(e.target.value === 'ar' ? 'ar' : 'en')}><option value="en">{t('lang.en')}</option><option value="ar">{t('lang.ar')}</option></select><small className="field-hint">{t('settings.langHint')}</small></label>
              {session!.guest
                ? <div className="guest-account-note full"><p>{t('guest.localNotice')}</p><Button type="button" variant="outline" onClick={openAuthScreen}><LogIn /> {t('auth.accountCta')}</Button></div>
                : <>
                    <label className="field">{t('settings.username')}<input name="username" value={usernameDraft} onChange={e => setUsernameDraft(e.target.value)} autoComplete="username" minLength={3} maxLength={20} dir="ltr" /><small className="field-hint">{t('auth.usernameHint')}</small></label>
                    <label className="field">{t('settings.email')}<input value={session!.email} readOnly dir="ltr" /></label>
                  </>}
              <label className="field">{t('settings.currency')}<select value={cur} onChange={e => { updatePrefs({ currency: e.target.value }); show(t('cur.saved')); }}>{CURRENCIES.map(c => <option key={c} value={c}>{c} · {i.currencyName(c)}</option>)}</select><small className="field-hint">{t('cur.hint')} {t('device.only')}</small></label>
            </div>
            {!session!.guest && <Button variant="outline" className="mt-5" onClick={() => void saveUsername()} disabled={usernameBusy}><Check /> {usernameBusy ? t('auth.working') : t('settings.usernameSave')}</Button>}
            {!session!.guest && <Button variant="outline" className="mt-5" onClick={() => logout()}><LogOut /> {t('settings.logout')}</Button>}
          </section>
          {isAndroid && <section className="panel settings-panel" aria-label={t('telda.title')}>
            <h2 className="settings-title"><Smartphone className="inline h-5 w-5" /> {t('telda.title')}</h2>
            <p className="text-sm leading-7 text-muted-foreground">{t('telda.body')}</p>
          </section>}
          <section className="panel settings-panel">
            <h2 className="settings-title"><Smartphone className="inline h-5 w-5" /> {t('settings.device')}</h2>
            <p className="text-sm leading-7 text-muted-foreground">{t('settings.deviceBody')}</p>
            <Button variant="outline" className="mt-5" onClick={() => { if (window.confirm(t('settings.confirmClear'))) { clearPrefs(); show(t('settings.cleared')); } }}><Trash2 /> {t('settings.clearDevice')}</Button>
          </section>
        </div>}

        <footer className="page-footer"><span><ShieldCheck /> {t('footer.left')}</span><span>{t('footer.right')} <Heart /></span></footer>
      </main>

      <Dialog open={modal !== null} onOpenChange={v => { if (!v && !busy) setModal(null); }}>
        <DialogContent className="modal-card">
          {modal && <>
            <DialogTitle>{t(`modal.${modal}.title` as TKey)}</DialogTitle>
            <DialogDescription>{t(`modal.${modal}.desc` as TKey)}</DialogDescription>
          </>}
          {modal === 'notifications' ? <div className="notification-list">
            <p>{budget ? (spent <= budget ? t('notif.budgetOk') : t('notif.budgetOver')) : t('notif.noBudget')}<small>{t('notif.budgetTag')}</small></p>
            {goal && <p>{t('notif.goal', { pct: goalPct })}<small>{t('notif.goalTag')}</small></p>}
            <p>{t('notif.count', { count: totals.count })}<small>{t('notif.activityTag')}</small></p>
          </div> : modal === 'help' ? <p className="text-sm leading-7 text-muted-foreground">{t('help.body')}</p> : modal && <form onSubmit={e => void submit(e)} noValidate>
            <div className="form-grid">
              {(modal === 'income' || modal === 'expense') && <label className="field full">{modal === 'income' ? t('form.descIncomeOptional') : t('form.descOptional')}<input name="description" maxLength={120} dir="auto" placeholder={modal === 'income' ? t('form.descIncomePh') : t('form.descPh')} /></label>}
              {modal === 'goalEdit' && <label className="field full">{t('form.goalName')}<input name="goalName" required maxLength={40} dir="auto" defaultValue={goal?.name ?? ''} placeholder={t('form.goalNamePh')} /></label>}
              {modal === 'invest' && <label className="field full">{t('form.kind')}<select name="kind" defaultValue={investKind}><option value="added">{t('inv.kind.added')}</option><option value="gain">{t('inv.kind.gain')}</option><option value="loss">{t('inv.kind.loss')}</option></select></label>}
              <label className={`field ${modal === 'income' || modal === 'expense' ? '' : 'full'}`}>{modal === 'budget' ? t('form.budget') : modal === 'goalEdit' ? t('form.goalTarget') : t('form.amount')}<input name="amount" type="number" inputMode="decimal" min="0.01" max={MAX_AMOUNT} step="0.01" required dir="ltr" defaultValue={modal === 'budget' ? budget ?? undefined : modal === 'goalEdit' ? goal?.target : undefined} placeholder="0.00" autoFocus /></label>
              {(modal === 'income' || modal === 'expense') && <label className="field">{t('form.category')}<select name="category" defaultValue={modal === 'income' ? 'Salary' : 'Food'}>{(modal === 'income' ? incomeCategories : expenseCategories).map(c => <option key={c} value={c}>{i.category(c)}</option>)}</select></label>}
              {(modal === 'income' || modal === 'expense' || modal === 'invest') && <label className="field full">{t('form.date')}<input name="date" type="date" dir="ltr" max={todayKey} value={pickedDate} onChange={e => setPickedDate(e.target.value)} />{pickedDate && pickedDate !== todayKey && <small className="field-hint date-warning">{t('form.dateHint')}</small>}</label>}
              {modal === 'invest' && <><label className="field full">{t('form.note')}<input name="note" maxLength={120} dir="auto" /></label><p className="field-hint full">{t('inv.available', { amount: i.money(Math.max(0, balance)) })}</p></>}
              {(modal === 'budget' || modal === 'goal' || modal === 'goalEdit') && <p className="device-note full"><Smartphone /> {t('device.only')}</p>}
            </div>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <Button type="submit" className="form-submit" disabled={busy}><Check />{busy ? t('form.saving') : modal === 'budget' ? t('form.saveBudget') : modal === 'goalEdit' ? t('form.saveGoal') : modal === 'goal' ? t('form.addGoal') : modal === 'invest' ? t('form.saveInv') : t('form.save')}</Button>
          </form>}
        </DialogContent>
      </Dialog>
      {toast && <div className={`toast-message ${toast.error ? 'toast-error' : ''}`} role={toast.error ? 'alert' : 'status'}>{toast.error ? <CircleAlert /> : <Check />}{toast.text}</div>}
    </div>
  );
}
