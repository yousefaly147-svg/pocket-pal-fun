import { describe, expect, it } from "vitest";

import { Route as arExpenses } from "@/routes/ar.expense-tracking";
import { Route as arBudget } from "@/routes/ar.monthly-budget";
import { Route as arSavings } from "@/routes/ar.savings-goals";
import { Route as enExpenses } from "@/routes/expense-tracking";
import { Route as enBudget } from "@/routes/monthly-budget";
import { Route as enSavings } from "@/routes/savings-goals";

const origin = "https://pocketjr.lovable.app";
const guides = [
  { slug: "monthly-budget", en: enBudget, ar: arBudget },
  { slug: "expense-tracking", en: enExpenses, ar: arExpenses },
  { slug: "savings-goals", en: enSavings, ar: arSavings },
] as const;

describe("guide canonical and language relationships", () => {
  for (const { slug, en, ar } of guides) {
    for (const [locale, route] of [
      ["en", en],
      ["ar", ar],
    ] as const) {
      it(`${locale}/${slug} references itself and preserves all language alternates`, async () => {
        const head = route.options.head;
        if (!head) throw new Error("Guide route is missing its head definition");
        // These static metadata functions do not read loader or router context.
        const metadata = await head({} as never);
        const links = metadata?.links ?? [];
        const englishUrl = `${origin}/${slug}`;
        const arabicUrl = `${origin}/ar/${slug}`;

        expect(links.filter((link) => link?.rel === "canonical")).toEqual([
          { rel: "canonical", href: locale === "en" ? englishUrl : arabicUrl },
        ]);
        expect(links.filter((link) => link?.rel === "alternate")).toEqual([
          { rel: "alternate", hrefLang: "en", href: englishUrl },
          { rel: "alternate", hrefLang: "ar", href: arabicUrl },
          { rel: "alternate", hrefLang: "x-default", href: englishUrl },
        ]);
      });
    }
  }
});
