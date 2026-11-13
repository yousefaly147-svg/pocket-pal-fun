import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { ar } from "@/lib/i18n/ar";
import { en } from "@/lib/i18n/en";
import { websiteSchema } from "@/lib/website-schema";
import { articleSchema, publicHead, toolSchema } from "@/lib/public-seo";
import { egpBudgetFaqs } from "@/lib/tool-content";

const origin = "https://pocketjr.lovable.app";
const publicPaths = [
  "/", "/ar",
  "/about", "/ar/about",
  "/help", "/ar/help",
  "/guides", "/ar/guides",
  "/privacy-policy", "/ar/privacy-policy",
  "/terms", "/ar/terms",
  "/monthly-budget", "/ar/monthly-budget",
  "/expense-tracking", "/ar/expense-tracking",
  "/savings-goals", "/ar/savings-goals",
  "/egp-budget-calculator", "/ar/egp-budget-calculator",
  "/monthly-expenses-template", "/ar/monthly-expenses-template",
  "/daily-budget-calculator", "/ar/daily-budget-calculator",
] as const;

const readPublicFile = (path: string) => readFileSync(resolve(process.cwd(), "public", path), "utf8");

describe("public search discovery files", () => {
  it("serves the exact public IndexNow verification key", () => {
    expect(readPublicFile("pocketjrindexnow20261031a9f4c82d.txt"))
      .toBe("pocketjrindexnow20261031a9f4c82d");
  });

  it("contains exactly the 24 canonical public URLs in the sitemap", () => {
    const sitemap = readPublicFile("sitemap.xml");
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? "");

    expect(urls).toHaveLength(24);
    expect(new Set(urls).size).toBe(24);
    expect(urls).toEqual(publicPaths.map((path) => `${origin}${path}`));
    expect(urls.every((url) => url.startsWith(`${origin}/`))).toBe(true);
    expect(urls.some((url) => /\/settings|\/transactions|delete-account|dashboard/i.test(url))).toBe(false);
  });

  it("keeps reciprocal English, Arabic and x-default alternates for every language pair", () => {
    const sitemap = readPublicFile("sitemap.xml");
    const blocks = sitemap.split("<url>").slice(1).map((part) => part.split("</url>")[0] ?? "");

    expect(blocks).toHaveLength(24);
    for (let index = 0; index < blocks.length; index += 2) {
      const english = blocks[index] ?? "";
      const arabic = blocks[index + 1] ?? "";
      const englishUrl = english.match(/<loc>([^<]+)<\/loc>/)?.[1];
      const arabicUrl = arabic.match(/<loc>([^<]+)<\/loc>/)?.[1];

      expect(englishUrl).toBeTruthy();
      expect(arabicUrl).toBeTruthy();
      for (const block of [english, arabic]) {
        expect(block).toContain(`hreflang="en" href="${englishUrl}"`);
        expect(block).toContain(`hreflang="ar" href="${arabicUrl}"`);
        expect(block).toContain(`hreflang="x-default" href="${englishUrl}"`);
      }
    }
  });

  it("includes one valid, non-future lastmod date for every public URL", () => {
    const sitemap = readPublicFile("sitemap.xml");
    const blocks = sitemap.split("<url>").slice(1).map((part) => part.split("</url>")[0] ?? "");
    const today = new Date().toISOString().slice(0, 10);

    expect(blocks).toHaveLength(24);
    for (const block of blocks) {
      const dates = block.split("<lastmod>").slice(1).map((part) => part.split("</lastmod>")[0] ?? "");
      expect(dates).toHaveLength(1);
      expect(dates[0]?.length).toBe(10);
      expect(dates[0]! <= today).toBe(true);
      expect(Number.isNaN(Date.parse(`${dates[0]}T00:00:00Z`))).toBe(false);
    }
  });
});

describe("homepage structured data", () => {
  it.each(["en", "ar"] as const)("provides accurate WebSite and SoftwareApplication schema for %s", (language) => {
    const schema = websiteSchema(language);
    const graph = schema["@graph"] as Array<Record<string, unknown>>;
    const organization = graph.find((node) => node["@type"] === "Organization");
    const website = graph.find((node) => node["@type"] === "WebSite");
    const application = graph.find((node) => node["@type"] === "SoftwareApplication");

    expect(schema["@context"]).toBe("https://schema.org");
    expect(organization?.["name"]).toBe("Pocketjr Finance");
    expect(organization?.["@id"]).toBe(`${origin}/#organization`);
    expect(website?.["name"]).toBe("Pocketjr Finance");
    expect(website?.["publisher"]).toEqual({ "@id": `${origin}/#organization` });
    expect(application?.["name"]).toBe("Pocketjr Finance");
    expect(application?.["publisher"]).toEqual({ "@id": `${origin}/#organization` });
    expect(String(application?.["description"])).toContain(language === "ar" ? "بالعربية والإنجليزية" : "English and Arabic");
    expect(String(application?.["description"])).not.toContain(language === "ar" ? "في مصر" : "for people in Egypt");
    expect(application?.["applicationCategory"]).toBe("FinanceApplication");
    expect(application?.["operatingSystem"]).toBe("Web browser");
    expect(application?.["isAccessibleForFree"]).toBe(true);
    for (const node of graph) {
      expect(node).not.toHaveProperty("aggregateRating");
      expect(node).not.toHaveProperty("review");
      expect(node).not.toHaveProperty("offers");
    }
    expect(application?.["url"]).toBe(language === "ar" ? `${origin}/ar` : `${origin}/`);
  });
});

describe("homepage resource navigation", () => {
  it("links directly to public guides from the main navigation in both languages", () => {
    const landing = readFileSync(resolve(process.cwd(), "src/components/pocket/landing-page.tsx"), "utf8");
    expect(landing).toContain("pagePath('/guides')");
    expect(landing).toContain("t('landing.navGuides')");
    expect(en["landing.navGuides"]).toBe("Guides & tools");
    expect(ar["landing.navGuides"]).toBe("الأدلة والأدوات");
  });
});

describe("bilingual public homepage explanation", () => {
  it("includes substantive and balanced product details in English and Arabic", () => {
    for (const dictionary of [en, ar]) {
      expect(dictionary["landing.detailTitle"].length).toBeGreaterThan(8);
      expect(dictionary["landing.detailTrackBody"].length).toBeGreaterThan(100);
      expect(dictionary["landing.detailAccountBody"].length).toBeGreaterThan(100);
      expect(dictionary["landing.detailLimitsBody"].length).toBeGreaterThan(100);
      expect(dictionary["landing.detailBudgetLink"].length).toBeGreaterThan(4);
      expect(dictionary["landing.detailExpensesLink"].length).toBeGreaterThan(4);
      expect(dictionary["landing.detailGoalsLink"].length).toBeGreaterThan(4);
    }
    expect(en["landing.detailLimitsBody"]).toContain("no universal bank connection");
    expect(ar["landing.detailLimitsBody"]).toContain("مفيش ربط تلقائي بكل البنوك");
  });
  
  it("uses clear and accurate bilingual expense-tracking search language", () => {
    expect(en["landing.heroHighlight"].toLowerCase()).toContain("expense tracker");
    expect(en["landing.heroBody"].toLowerCase()).toContain("monthly budgets");
    expect(en["landing.heroBody"].toLowerCase()).toContain("without downloading an app");
    expect(ar["landing.heroHighlight"]).toContain("مصاريف");
    expect(ar["landing.heroBody"]).toContain("أهداف الادخار");
    expect(ar["landing.heroBody"]).toContain("من غير تحميل تطبيق");
  });
});

describe("EGP calculator structured data", () => {
  it.each(["en", "ar"] as const)("keeps calculator FAQ schema aligned with visible %s FAQs", (language) => {
    const title = language === "ar" ? "حاسبة الميزانية بالجنيه المصري" : "Free EGP monthly budget calculator";
    const description = language === "ar" ? "خطط ميزانيتك بالجنيه المصري." : "Plan a monthly budget in Egyptian pounds.";
    const schema = toolSchema(language, "/egp-budget-calculator", title, description, egpBudgetFaqs[language]);
    const graph = schema["@graph"] as Array<Record<string, unknown>>;
    const faqPage = graph.find((node) => node["@type"] === "FAQPage");
    const questions = faqPage?.["mainEntity"] as Array<Record<string, unknown>>;

    expect(questions).toHaveLength(4);
    expect(questions.map((question) => question["name"])).toEqual(egpBudgetFaqs[language].map((faq) => faq.q));
    expect(questions.every((question) => Boolean((question["acceptedAnswer"] as Record<string, unknown>)?.["text"]))).toBe(true);
  });

  it("provides a self-canonical and reciprocal localized calculator head", () => {
    const head = publicHead({
      lang: "ar",
      enPath: "/egp-budget-calculator",
      title: "حاسبة الميزانية بالجنيه المصري",
      description: "خطط ميزانيتك بالجنيه المصري.",
      schema: toolSchema("ar", "/egp-budget-calculator", "حاسبة الميزانية", "وصف", egpBudgetFaqs.ar),
    });
    expect(head.links).toContainEqual({ rel: "canonical", href: `${origin}/ar/egp-budget-calculator` });
    expect(head.links).toContainEqual({ rel: "alternate", hrefLang: "en", href: `${origin}/egp-budget-calculator` });
    expect(head.links).toContainEqual({ rel: "alternate", hrefLang: "x-default", href: `${origin}/egp-budget-calculator` });
  });
});

describe("canonical Arabic homepage navigation", () => {
  it("does not emit trailing-slash Arabic homepage links that redirect", () => {
    const navigationFiles = [
      "src/components/pocket/lang-toggle.tsx",
      "src/components/pocket/landing-page.tsx",
      "src/components/pocket/public-page-layout.tsx",
      "src/components/pocket/guide-article-page.tsx",
    ];
    for (const path of navigationFiles) {
      const source = readFileSync(resolve(process.cwd(), path), "utf8");
      expect(source, path).not.toContain("'/ar/'");
    }
  });
});

describe("guide article structured data", () => {
  it.each([
    ["en", "/monthly-budget", "Monthly Budget: Make Your Salary Last | Pocketjr Finance"],
    ["ar", "/monthly-budget", "الميزانية الشهرية: إزاي تخلي المرتب يكفي | Pocketjr Finance"],
    ["en", "/expense-tracking", "Expense Tracking: App or Spreadsheet? | Pocketjr Finance"],
    ["ar", "/expense-tracking", "تتبع المصاريف: تطبيق ولا جدول؟ | Pocketjr Finance"],
    ["en", "/savings-goals", "How to Set a Realistic Savings Goal"],
    ["ar", "/savings-goals", "إزاي تحدد هدف ادخار واقعي"],
  ] as const)("creates factual Article and breadcrumb data for %s %s", (lang, path, headline) => {
    const schema = articleSchema(lang, path, headline, "Guide description");
    const graph = schema["@graph"] as Array<Record<string, unknown>>;
    const article = graph.find((node) => node["@type"] === "Article");
    const breadcrumb = graph.find((node) => node["@type"] === "BreadcrumbList");
    const breadcrumbItems = breadcrumb?.["itemListElement"] as Array<Record<string, unknown>>;
    expect(breadcrumbItems?.[0]?.["item"]).toBe(lang === "ar" ? `${origin}/ar` : `${origin}/`);
    expect(article?.["headline"]).toBe(headline);
    expect(article?.["mainEntityOfPage"]).toBe(`${origin}${lang === "ar" ? `/ar${path}` : path}`);
    expect((article?.["author"] as Record<string, unknown>)?.["name"]).toBe("Pocketjr Finance");
    expect(breadcrumb?.["@type"]).toBe("BreadcrumbList");
    expect(article).not.toHaveProperty("datePublished");
    expect(article).not.toHaveProperty("aggregateRating");
    expect(article).not.toHaveProperty("review");
  });
});


describe("practical guide content", () => {
  it("keeps worked examples and practical decision steps in both guide languages", () => {
    const guide = readFileSync(resolve(process.cwd(), "src/components/pocket/guide-article-page.tsx"), "utf8");

    for (const phrase of [
      "A worked monthly plan",
      "When income changes from month to month",
      "Avoid counting the same money twice",
      "A worked example with no assumed investment return",
      "What a tracking goal does and does not do",
      "مثال عملي لميزانية شهرية",
      "لو دخلك بيتغير من شهر للتاني",
      "تجنب حساب نفس الفلوس مرتين",
      "مثال عملي من غير افتراض عائد استثماري",
      "أداة متابعة الهدف بتعمل إيه ومش بتعمل إيه",
      "These guides were prepared to help Pocketjr users",
      "الأمثلة والأرقام المذكورة افتراضية للتوضيح",
      "Last updated: 13 November 2026",
      "آخر تحديث: 13 نوفمبر 2026",
    ]) {
      expect(guide).toContain(phrase);
    }
  });

  it("explains the EGP calculator formula, worked example and limitations in both languages", () => {
    const calculator = readFileSync(
      resolve(process.cwd(), "src/components/pocket/egp-budget-calculator.tsx"),
      "utf8",
    );

    for (const phrase of [
      "How the calculation works",
      "A fictional worked example",
      "What this calculator does not estimate",
      "Remaining = 10,000",
      "طريقة الحساب خطوة بخطوة",
      "مثال حسابي افتراضي",
      "حدود الحاسبة",
      "ومش بتسحب بيانات من حسابك البنكي",
    ]) {
      expect(calculator).toContain(phrase);
    }
  });
});
