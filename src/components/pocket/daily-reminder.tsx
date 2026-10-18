import { useCallback, useEffect, useRef, useState } from "react";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, type TKey } from "@/lib/i18n";
import { delayUntilNextDailyReminder } from "@/lib/daily-reminder";

type ReminderConfig = { enabled: boolean; time: string };
type ReminderStatus = "enabled" | "disabled" | "requesting" | "permissionDenied" | "unsupported" | "error";
type ReminderAction = "enable" | "save" | "disable";
const STORAGE_KEY = "pocket:daily-reminder:v1";
const DEFAULT_TIME = "20:00";

function readConfig(): ReminderConfig {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<ReminderConfig> | null;
    const time = typeof raw?.time === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(raw.time)
      ? raw.time
      : DEFAULT_TIME;
    return { enabled: raw?.enabled === true, time };
  } catch {
    return { enabled: false, time: DEFAULT_TIME };
  }
}

function writeConfig(config: ReminderConfig): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch { /* local preference is optional */ }
}

export function DailyReminder() {
  const { t, lang } = useI18n();
  const [config, setConfig] = useState<ReminderConfig>({ enabled: false, time: DEFAULT_TIME });
  const [draftTime, setDraftTime] = useState(DEFAULT_TIME);
  const [isNative, setIsNative] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<ReminderStatus | null>(null);
  const actionRef = useRef<ReminderAction>("enable");
  const pendingTimeRef = useRef(DEFAULT_TIME);
  const configRef = useRef(config);

  const persist = useCallback((next: ReminderConfig) => {
    configRef.current = next;
    setConfig(next);
    writeConfig(next);
  }, []);

  const onNativeResult = useCallback((success: boolean) => {
    const action = actionRef.current;
    const time = pendingTimeRef.current;
    setBusy(false);

    if (action === "disable") {
      persist({ enabled: false, time });
      setDraftTime(time);
      setStatus("disabled");
      return;
    }
    if (success) {
      persist({ enabled: true, time });
      setDraftTime(time);
      setStatus("enabled");
    } else {
      persist({ enabled: false, time });
      setDraftTime(time);
      setStatus("permissionDenied");
    }
  }, [persist]);

  useEffect(() => {
    const saved = readConfig();
    setConfig(saved);
    configRef.current = saved;
    setDraftTime(saved.time);
    setIsNative(Boolean(window.PocketPalAndroid));
    if (saved.enabled && window.PocketPalAndroid) {
      setStatus(window.PocketPalAndroid.areDailyReminderNotificationsEnabled?.() === false
        ? "permissionDenied"
        : "enabled");
    } else if (saved.enabled && "Notification" in window && Notification.permission !== "granted") {
      setStatus("permissionDenied");
      const disabled = { ...saved, enabled: false };
      setConfig(disabled);
      configRef.current = disabled;
      writeConfig(disabled);
    } else {
      setStatus(saved.enabled ? "enabled" : "disabled");
    }
  }, []);

  useEffect(() => {
    if (!isNative) return;
    window.__pocketJrOnDailyReminderResult = onNativeResult;
    return () => {
      if (window.__pocketJrOnDailyReminderResult === onNativeResult) {
        delete window.__pocketJrOnDailyReminderResult;
      }
    };
  }, [isNative, onNativeResult]);

  // Browser reminders are intentionally best-effort: without a push service, the page must remain open.
  useEffect(() => {
    if (isNative || !config.enabled || !("Notification" in window) || Notification.permission !== "granted") return;
    let timer = 0;
    const scheduleNext = () => {
      let delay: number;
      try {
        delay = delayUntilNextDailyReminder(config.time);
      } catch {
        return;
      }
      timer = window.setTimeout(() => {
        if (Notification.permission === "granted") {
          try {
            new Notification(t("reminder.notificationTitle"), {
              body: t("reminder.notificationBody"),
              icon: "/favicon.ico",
              tag: "pocketjr-daily-reminder",
            });
          } catch { /* the browser may block notifications in background tabs */ }
        }
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => window.clearTimeout(timer);
  }, [isNative, config.enabled, config.time, t, lang]);

  const applyNativeReminder = (enabled: boolean, time: string, action: ReminderAction) => {
    const bridge = window.PocketPalAndroid;
    if (!bridge?.configureDailyReminder) {
      setBusy(false);
      setStatus("unsupported");
      return;
    }
    actionRef.current = action;
    pendingTimeRef.current = time;
    setBusy(true);
    setStatus("requesting");
    try {
      bridge.configureDailyReminder(
        enabled,
        Number(time.slice(0, 2)),
        Number(time.slice(3, 5)),
        t("reminder.notificationTitle"),
        t("reminder.notificationBody"),
      );
    } catch {
      setBusy(false);
      setStatus("error");
    }
  };

  const enableOrSave = async () => {
    const time = /^([01]\d|2[0-3]):([0-5]\d)$/.test(draftTime) ? draftTime : DEFAULT_TIME;
    if (isNative) {
      applyNativeReminder(true, time, config.enabled ? "save" : "enable");
      return;
    }
    if (!("Notification" in window)) {
      setStatus("unsupported");
      return;
    }
    setBusy(true);
    setStatus("requesting");
    try {
      const permission = Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();
      if (permission !== "granted") {
        persist({ enabled: false, time });
        setDraftTime(time);
        setStatus("permissionDenied");
        return;
      }
      persist({ enabled: true, time });
      setDraftTime(time);
      setStatus("enabled");
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  };

  const disable = () => {
    const time = draftTime;
    if (isNative) {
      applyNativeReminder(false, time, "disable");
      return;
    }
    persist({ enabled: false, time });
    setStatus("disabled");
  };

  const statusKey: Record<ReminderStatus, TKey> = {
    enabled: "reminder.status.enabled",
    disabled: "reminder.status.disabled",
    requesting: "reminder.status.requesting",
    permissionDenied: "reminder.status.permissionDenied",
    unsupported: "reminder.status.unsupported",
    error: "reminder.status.error",
  };

  return (
    <section className="panel settings-panel" aria-labelledby="daily-reminder-title">
      <h2 className="settings-title" id="daily-reminder-title">
        <BellRing className="inline h-5 w-5" aria-hidden="true" /> {t("reminder.title")}
      </h2>
      <p className="text-sm leading-7 text-muted-foreground">{t("reminder.description")}</p>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        {t(isNative ? "reminder.nativeDescription" : "reminder.browserDescription")}
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="field">
          {t("reminder.time")}
          <input
            type="time"
            value={draftTime}
            onChange={(event) => setDraftTime(event.target.value)}
            aria-label={t("reminder.time")}
            dir="ltr"
          />
        </label>
        <Button type="button" onClick={() => void enableOrSave()} disabled={busy}>
          {busy ? t("reminder.buttonWorking") : config.enabled ? t("reminder.save") : t("reminder.enable")}
        </Button>
        {config.enabled && (
          <Button type="button" variant="outline" onClick={disable} disabled={busy}>
            {t("reminder.disable")}
          </Button>
        )}
      </div>
      {status && (
        <p
          className="mt-3 text-xs leading-6 text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          {t(statusKey[status])}
        </p>
      )}
    </section>
  );
}
