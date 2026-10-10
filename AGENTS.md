<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Financial data comes only from the user's external My Money Express API via `src/lib/api.ts` (browser fetch with Bearer JWT); no Lovable Cloud database, because the user's backend is the source of truth.
- Use only the API routes confirmed to exist (auth register/login, GET /api/data, POST/DELETE transactions and investments); never assume list endpoints like GET /api/transactions.
- The API base URL resolves from `window.MY_MONEY_API_URL`, then `VITE_MY_MONEY_API_URL`, then the built-in default; it is public config, not a secret.
- Data the API cannot store (budget, goal) lives in browser storage keyed by account id and must be labelled device-only in the UI.
- Investment "added" entries are paired with an "Investment" expense; finance helpers count it once in cash and exclude it from spending.
- All UI text goes through the typed i18n dictionaries (`src/lib/i18n`) with matching keys per language; user-entered text and API category values are never altered, only display-translated.
- Numbers always render with Western digits; Arabic switches `<html dir="rtl">` and CSS mirrors via `[dir=rtl]` overrides.
- Use the root route as a state-driven app shell for its navigation views; this keeps actions and totals synchronized across views.
- Define visual styling and CSS cartoon artwork in the global design system; use semantic component variants for interactive controls.
- The currency preference is a display label only (per account, device-only); never convert stored amounts with it, because the API has no currency field.
- Live market figures come only from named public sources (ExchangeRate-API, gold-api.com) with source and timestamp shown; on failure show unavailable, never fallback numbers.
- Transaction dates are owned by the server; the app sends `created_at` but must detect and tell the user when the server ignores it.
- Google sign-in stays hidden unless VITE_GOOGLE_CLIENT_ID is set and VITE_GOOGLE_AUTH_READY is 'true', because the token must be verified by the server (POST /api/auth/google, not yet built).
- The initial language is read from `<html lang>` set by the head boot script, so there's no flash and nothing overwrites it on refresh.
