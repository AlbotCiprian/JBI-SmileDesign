/**
 * URL-ul canonical al site-ului (folosit pentru sitemap, robots, JSON-LD,
 * metadata canonical, OG tags).
 *
 * Prioritate:
 *  1. NEXT_PUBLIC_SITE_URL — set explicit (recomandat când ai domeniu custom)
 *  2. VERCEL_PROJECT_PRODUCTION_URL — auto-injectat de Vercel (alias-ul de producție,
 *     ex: "jbi-smile-design.vercel.app")
 *  3. VERCEL_URL — deployment specific (ex: per preview / branch)
 *  4. http://localhost:3000 — fallback dev
 *
 * Se intoarce mereu fara trailing slash si fara /path.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlash(ensureProtocol(explicit));

  const prodAlias = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prodAlias) return `https://${stripTrailingSlash(prodAlias)}`;

  const deploymentUrl = process.env.VERCEL_URL?.trim();
  if (deploymentUrl) return `https://${stripTrailingSlash(deploymentUrl)}`;

  return "http://localhost:3000";
}

function ensureProtocol(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}
