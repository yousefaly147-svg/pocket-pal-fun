import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
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
  ];

  it.each(publicPaths)("matches public route %s instead of falling back to not found", (path) => {
    const matches = router.matchRoutes(path);
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
