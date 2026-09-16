import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CHAPTER_ORDER } from "@/lib/chapters";
import { SERVICES } from "@/lib/services";
import data from "@/data/prescriptions.json";
import type { Prescription } from "@/lib/types";

const prescriptions = data as unknown as Prescription[];

export const dynamic = "force-static";

const lastModified = new Date("2026-09-16");

export default function sitemap(): MetadataRoute.Sitemap {
  const root: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified,
    changeFrequency: "daily",
    priority: 1,
  };
  const chapters: MetadataRoute.Sitemap[number][] = CHAPTER_ORDER.map((c) => ({
    url: `${SITE_URL}/doctor/chapter/${c.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  const cases: MetadataRoute.Sitemap[number][] = prescriptions.map((p) => ({
    url: `${SITE_URL}/doctor/case/${p.id}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const portals: MetadataRoute.Sitemap[number][] = [
    {
      url: `${SITE_URL}/patient`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...SERVICES.map((s) => ({
      url: `${SITE_URL}/patient/new/${s.type}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    {
      url: `${SITE_URL}/patient/tickets`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [root, ...chapters, ...cases, ...portals];
}