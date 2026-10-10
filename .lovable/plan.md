# Pocket Pal: next iteration plan

## 1. What I checked
- **Language today:** a tiny script in the page head sets Arabic + right-to-left before the page shows. But the language setting itself starts as English on every load and switches to Arabic only after the page is running. In between, a second step writes English/left-to-right back onto the page. Likely result after refresh: a flash of English text, the layout jumping direction, or the wrong direction sticking around. **Not yet confirmed in a browser.** Step 1 is to reproduce it.
- **Entry form:** the description box is required in the form, and the save code blocks an empty one with an error.
- **Dates:** entries get their date from `created_at`, which the server sets. The app never sends a date.
- **Currency:** Settings has a currency box that is switched off and locked to EGP. "EGP" is written directly into about 8 translated sentences.
- **Your API (probed live, read-only):** `/api/devices` and `/api/auth/google` both return your old website's page, not JSON. So there is **no confirmed Google sign-in route**, and I can't confirm `/api/devices` is a real API route either. I can't see your server's code from here. Nothing below assumes a route exists until you confirm it.

## 2. Feature plans

### (1) Language and direction on refresh (app work only)
- Read the saved language **before** the first render, using the value the head script already applied to the page, so the app starts in the right language with no flip.
- Remove the step that writes English/left-to-right over the head script's work. Only change the page language and direction when the user actually switches.
- Keep the head script, but have it also handle a saved `en` explicitly.
- Keep Western digits as they are. Keep the choice saved per device.

### (2) Google sign-in / sign-up (needs work on your server + setup by you)
Your server issues its own login tokens, so Google sign-in has to be checked **on your server**. The app alone can't do it safely.
- **Your setup (outside chat):** create a Google OAuth Client ID in Google Cloud Console. Add the preview URL, moneyjr.lovable.app and any custom domain as allowed JavaScript origins. The Client ID is public, so it can go in the app's settings (`VITE_GOOGLE_CLIENT_ID`). Never paste any client secret in chat.
- **Server change you'd need (new, does not exist today):** `POST /api/auth/google` taking `{ credential }` (a Google ID token). The server checks it with Google's official library (`google-auth-library` `verifyIdToken`, with your Client ID as the audience), finds or creates the user by verified email, and returns `{ token, user }` like login does. Decide how existing email/password accounts with the same email get linked (recommended: link only if Google says the email is verified).
- **App work:** add a "Continue with Google" button (Google Identity Services script) to the sign-in screen, in English and Arabic. Send the credential to the new route and reuse the current sign-in handling. Hide the button until the Client ID and route are both set up.

### (3) Optional descriptions (app only, server behaviour unconfirmed)
- Remove the "required" rule and the empty-description error. Send an empty string. Lists already show a fallback label ("No description"), translated.
- Risk: your server might reject an empty description. I'll check with a disposable account. If it does, the server needs a small change. I won't fill in placeholder text, so what you typed stays exactly as entered.

### (4) Choosing a date + viewing past days (needs a server change)
- **Today:** the server sets `created_at`, so a date you pick can't be saved. Faking it in the browser would be wrong on other devices.
- **Server change needed:** accept an optional `date` (`YYYY-MM-DD`) or `created_at` on `POST /api/transactions` and `POST /api/investments`. Check it (valid, not in the future) and store it. Otherwise use the current time. Return it in `/api/data`.
- **App work:** a date field (default today) in the income/expense form, shown only once the server supports it. A "Day view" with a date picker and previous/next day arrows. It shows that day's income, expenses and net change (income minus non-investment spending, using the same no-double-count rule as now) plus that day's entries. Days are worked out in the device's local time zone. Dates are shown with Western digits.
- Investment "added" entries and their paired expense get the same date.

### (5) Currencies
Safe recommendation, in stages:
- **Stage A (app only, recommended now):** your amounts stay stored as EGP. Settings gets a currency choice (EGP default; e.g. USD, EUR, SAR, AED, GBP). Choosing one converts **for display only**, using a named rate source (e.g. a free daily rate service such as Frankfurter/ECB, with rates cached for one day and labelled "approx., rates from X on <date>"). Any amount you type in another currency is converted back to EGP before it's sent. Stored values are never changed. If rates can't load, the app falls back to EGP with a notice.
- **Stage B (needs a server change, later):** store a currency on each entry so mixed-currency records are exact. Not done now.
- Choosing a currency is saved per device per account, and labelled "device-only" like budget and goal. Budget and goal stay stored in EGP.
- Alternative if you prefer: switch only the currency label/symbol with no conversion. **Not recommended**, because it would show EGP amounts as dollars, for example.
- Please decide: Stage A with conversion, or label-only.

## 3. Exact file changes (app)
- `src/lib/i18n/index.tsx`: start-up language from the page, remove the overwrite, stronger boot script
- `src/routes/__root.tsx`: boot script tweak; Google script only when configured
- `src/lib/api.ts`: `googleLogin`, optional `date` on add calls (only when supported), `description` optional
- `src/lib/auth.tsx`: `loginWithGoogle`
- `src/components/pocket/auth-screen.tsx`: Google button
- `src/components/pocket/dashboard.tsx`: optional description, date field, Day view, currency-aware amounts, enabled currency picker
- New `src/lib/currency.ts`: currency list, rate fetch/cache, convert to and from EGP
- `src/lib/finance.ts`: `dayKeyOf`, `daySummary`
- `src/lib/device-prefs.ts`: currency preference per account
- `src/lib/i18n/en.ts`, `ar.ts`: new keys; replace hard-coded "EGP" in sentences with `{currency}`
- `src/styles.css`: Day view, date field, Google button (cartoon style, mobile, RTL)
- Tests: `src/test/finance.test.ts` (day summaries, investment rule), new `currency.test.ts`, new `i18n-boot.test.tsx`
- `AGENTS.md`: rules for display-only conversion and server-owned dates

## 4. Server changes (yours, on Render)
1. `POST /api/auth/google`: new, verifies the Google ID token on the server
2. `POST /api/transactions` / `POST /api/investments`: accept an optional date
3. (If needed) allow empty `description`
4. Add any custom domain to CORS
The app features in (2) and (4) stay hidden until these are live, so nothing breaks before then.

## 5. Order of work
1. Language fix + optional descriptions + currency Stage A (app only, can ship now)
2. Day view using the existing server dates (works now, just no picking a date)
3. Date field, once the server accepts a date
4. Google button, once you've set up the Client ID and the server route

## 6. Tests
- Automated: day grouping across time zones and midnight, net change without double counting, currency conversion both ways with rounding, translation key match between languages, language picked on first render.
- Browser (disposable example.com account, fake amounts only): refresh in Arabic and English on desktop and phone, with no flash and the correct direction. Save an entry with no description. Day view totals match the list. Switch currency, check the amounts, and check the EGP values sent to the server are unchanged. Log out, log in with a second account, and check isolation.
- Google and date picking get tested only after the server changes, again with disposable accounts.

## Risks
- Exchange rates are approximate and depend on an outside service.
- Day boundaries depend on the device's time zone.
- Linking Google accounts to existing accounts must be done on your server, or someone could take over an account.

## Open questions
1. Currency: display conversion (Stage A), or label-only?
2. Can you make the server changes in section 4, or should I write exact code snippets for you to apply?
3. Is `/api/devices` a real route? It currently returns a web page.
