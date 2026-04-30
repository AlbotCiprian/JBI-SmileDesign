import type { MetadataRoute } from "next";

const baseUrl = "https://jbismiledesign.md";
const legalSlugs = ["privacy-policy", "cookie-policy", "termeni-conditii"];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/en", "/ru", ...legalSlugs.map((slug) => `/${slug}`), ...legalSlugs.map((slug) => `/en/${slug}`), ...legalSlugs.map((slug) => `/ru/${slug}`)];

  return routes.map((route) => ({
    url: `${baseUrl}${route || "/"}`,
    lastModified: new Date(),
    changeFrequency: route.includes("policy") || route.includes("termeni") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route === "/en" || route === "/ru" ? 0.9 : 0.5,
  }));
}
