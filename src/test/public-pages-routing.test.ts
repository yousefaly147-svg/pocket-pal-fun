import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

const publicPages = ["/about", "/help", "/guides", "/privacy-policy", "/terms"] as const;

describe("public information pages", () => {
  it.each(publicPages)("matches %s as a real route", (path) => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });

    const matches = router.matchRoutes(path);

    expect(matches.at(-1)?.routeId).toBe(path);
  });
});
