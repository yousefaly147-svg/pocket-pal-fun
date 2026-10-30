import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

const publicPages = [
  "/about",
  "/help",
  "/guides",
  "/privacy-policy",
  "/terms",
  "/ar/",
  "/ar/about",
  "/ar/help",
  "/ar/guides",
  "/ar/privacy-policy",
  "/ar/terms",
  "/ar/delete-account",
  "/monthly-budget",
  "/expense-tracking",
  "/savings-goals",
  "/ar/monthly-budget",
  "/ar/expense-tracking",
  "/ar/savings-goals",
] as const;

describe("public information pages and SEO article routes", () => {
  // Each locale is a real route so Google can crawl and index its language-specific URL.
  it.each(publicPages)("matches %s as a real route", (path) => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });

    const matches = router.matchRoutes(path);

    expect(matches.at(-1)?.routeId).toBe(path);
  });
});
