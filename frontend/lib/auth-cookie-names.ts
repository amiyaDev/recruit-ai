// Plain constants only — no "use client", no nookies import — so this can
// be safely imported from both client components (lib/cookies.ts) and the
// edge/Node proxy runtime (proxy.ts), which is a separate bundle outside
// the React tree.
export const ACCESS_TOKEN_COOKIE = "recruitai_access_token";
export const REFRESH_TOKEN_COOKIE = "recruitai_refresh_token";
