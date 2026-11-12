export const ADSENSE_SITE_VERIFICATION_META = {
  name: "google-adsense-account",
  content: "ca-pub-3201179915931193",
} as const;

export const ADSENSE_CLIENT_ID = "ca-pub-3201179915931193";

export const ADSENSE_LOADER_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

/** Loader only: no ad units, no Auto ads configuration. */
export const ADSENSE_LOADER_SCRIPT = {
  async: true,
  src: ADSENSE_LOADER_SRC,
  crossOrigin: "anonymous",
} as const;
