import type { MetadataRoute } from "next";
import { SITE_URL, PATIENT_SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * robots.txt is read only from the ORIGIN root
 * (https://drahmedyousefmd-prog.github.io/robots.txt) — the /estesharah subpath
 * file is ignored. So this single file governs both sites.
 *
 * No `Disallow` rules on purpose: private pages carry a `<meta name="robots"
 * content="noindex, nofollow">` tag, and a crawler must be allowed to fetch a
 * page to see that tag.
 */
export default function robots(): MetadataRoute.Robots {
  const allow = "/" as const;
  return {
    rules: [
      { userAgent: "*", allow },
      // AI answer-engine crawlers (explicitly allowed).
      { userAgent: "OAI-SearchBot", allow },
      { userAgent: "ChatGPT-User", allow },
      { userAgent: "Claude-SearchBot", allow },
      { userAgent: "Claude-User", allow },
      { userAgent: "PerplexityBot", allow },
      // Training crawlers are left to the `*` rule; add per-agent Disallow to block.
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${PATIENT_SITE_URL}/sitemap.xml`],
  };
}
