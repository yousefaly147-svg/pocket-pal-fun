import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { ar } from "@/lib/i18n/ar";
import { en } from "@/lib/i18n/en";
import { websiteSchema } from "@/lib/website-schema";

const origin = "https://pocketjr.lovable.app";
const publicPaths = [
  "/", "/ar/",
  "/about", "/ar/about",
  "/help", "/ar/help",
  "/guides", "/ar/guides",
  "/privacy-policy", "/ar/privacy-policy",
  "/terms", "/ar/terms",
  "/monthly-budget", "/ar/monthly-budget",
  "/expense-tracking", "/ar/expense-tracking",
  "/savings-goals", "/ar/savings-goals",
] as const;

const readPublicFile = (path: string) => readFileSync(resolve(process.cwd(), "public", path), "utf8");

describe("public search discovery files", () => {
  it("serves the exact public IndexNow verification key", () => {
    expect(readPublicFile("pocketjrindexnow20261031a9f4c82d.txt"))
      .toBe("pocketjrindexnow20261031a9f4c82d");
  });

  it("contains exactly the 18 canonical public URLs in the sitemap", () => {
    const sitemap = readPublicFile("sitemap.xml");
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? "");

    expect(urls).toHaveLength(18);
    expect(new Set(urls).size).toBe(18);
    expect(urls).toEqual(publicPaths.map((path) => `${origin}${path}`));
    expect(urls.every((url) => url.startsWith(`${origin}/`))).toBe(true);
    expect(sitemap).not.toMatch(/delete-account|dashboard|\/settings|\/transactions/i);
  });

  it("keeps reciprocal English, Arabic and x-default alternates for every language pair", () => {
    const sitemap = readPublicFile("sitemap.xml");
    const blocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);

    expect(blocks).toHaveLength(18);
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

  it("updates lastmod only for the two home pages changed in this pass", () => {
    const sitemap = readPublicFile("sitemap.xml");
    const blocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
    const changed = blocks.filter((block) => block.includes("<lastmod>2026-10-31</lastmod>"));
    const untouched = blocks.filter((block) => block.includes("<lastmod>2026-10-30</lastmod>"));

    expect(changed).toHaveLength(2);
    expect(changed[0]).toContain("<loc>https://pocketjr.lovable.app/</loc>");
    expect(changed[1]).toContain("<loc>https://pocketjr.lovable.app/ar/</loc>");
    expect(untouched).toHaveLength(16);
  });
});

describe("homepage structured data", () => {
  it.each(["en", "ar"] as const)("provides accurate WebSite and SoftwareApplication schema for %s", (language) => {
    const schema = websiteSchema(language);
    const graph = schema["@graph"] as Array<Record<string, unknown>>;
    const website = graph.find((node) => node["@type"] === "WebSite");
    const application = graph.find((node) => node["@type"] === "SoftwareApplication");

    expect(schema["@context"]).toBe("https://schema.org");
    expect(website?.["name"]).toBe("Pocketjr Finance");
    expect(application?.["name"]).toBe("Pocketjr Finance");
    expect(application?.["applicationCategory"]).toBe("FinanceApplication");
    expect(application?.["operatingSystem"]).toBe("Web browser");
    expect(application?.["isAccessibleForFree"]).toBe(true);
    for (const node of graph) {
      expect(node).not.toHaveProperty("aggregateRating");
      expect(node).not.toHaveProperty("review");
      expect(node).not.toHaveProperty("offers");
    }
    expect(application?.["url"]).toBe(language === "ar" ? `${origin}/ar/` : `${origin}/`);
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
    expect(en["landing.detailLimitsBody"]).toContain("not a bank");
    expect(ar["landing.detailLimitsBody"]).toContain("مفيش ربط تلقائي بكل البنوك");
  });
});
