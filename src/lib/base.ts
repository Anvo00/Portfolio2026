/**
 * Prefix a root-absolute path (e.g. "/images/x.svg", "/progetti/foo") with the
 * site's configured `base`, so links and public assets still resolve when the
 * site is served from a subfolder on GitHub Pages (anvo00.github.io/<base>/).
 *
 * External URLs (http:, mailto:, tel:), protocol-relative URLs and bare in-page
 * anchors (#id) are returned untouched. CSS url() paths do NOT need this — Vite
 * rewrites those with the base automatically at build time.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, ""); // "" when base is "/"

export function withBase(path = "/"): string {
  if (!path) return path;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${p}`;
}
