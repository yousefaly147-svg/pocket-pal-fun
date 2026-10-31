# Pocketjr Finance

Pocketjr Finance is a bilingual personal-finance recordkeeping web app for people who want a clearer view of their income, spending and savings. Open the live website at **https://pocketjr.lovable.app** and use it in English or Arabic.

## What it helps you track

- **Income and expenses:** record transactions with dates, categories and descriptions, then review activity over time.
- **Monthly budgets:** set a spending limit and compare it with the expenses you record.
- **Savings goals:** create multiple goals and track progress toward each target.
- **Investments:** keep a manual record of contributions, gains and losses.
- **Accounts and preferences:** start in guest mode with records kept on that device, or sign in to save supported account data and preferences for use on other signed-in devices.
- **Language and currency display:** switch between English and Arabic and choose a display currency. Changing the currency label does not convert existing amounts.

## Important limitations

Pocketjr is a personal recordkeeping tool, **not a bank, payment wallet or investment service**. It does not execute payments, buy or sell investments, provide financial advice, or connect automatically to every bank. Optional Telda notification import is an Android-specific feature of a compatible Pocketjr Android build and requires notification access; the website itself cannot read Android notifications. The website is available in a browser; this repository does not imply that an Android release is published on Google Play.

## Public resources

- [Live website](https://pocketjr.lovable.app/)
- [Money guides](https://pocketjr.lovable.app/guides)
- [Arabic money guides](https://pocketjr.lovable.app/ar/guides)
- [About Pocketjr](https://pocketjr.lovable.app/about)
- [Help and FAQ](https://pocketjr.lovable.app/help)
- [Privacy policy](https://pocketjr.lovable.app/privacy-policy)

## Search engine discovery

The public sitemap is available at [https://pocketjr.lovable.app/sitemap.xml](https://pocketjr.lovable.app/sitemap.xml). To notify IndexNow-compatible search engines about the public pages changed in this SEO update, open **GitHub → Actions → Notify search engines with IndexNow → Run workflow**. This workflow is manual, validates that the public key file is deployed, and submits only the updated canonical public URLs. An accepted notification helps search engines discover changes; it does **not** guarantee crawling, indexing or ranking.

## Development

This project uses [Lovable](https://lovable.dev) and is synchronized with its linked GitHub repository.

```sh
git clone https://github.com/yousefaly147-svg/pocket-pal-fun.git
cd pocket-pal-fun
bun install --frozen-lockfile
bun run dev
```

The CI workflow runs the TypeScript check, test suite and production build on changes to the main branch and pull requests.
