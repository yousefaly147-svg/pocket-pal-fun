import { describe, expect, it } from "vitest";
import { ADSENSE_SITE_VERIFICATION_META } from "./adsense-verification";

describe("AdSense site verification metadata", () => {
  it("uses the publisher meta tag expected by Google AdSense", () => {
    expect(ADSENSE_SITE_VERIFICATION_META).toEqual({
      name: "google-adsense-account",
      content: "ca-pub-3201179915931193",
    });
  });
});
