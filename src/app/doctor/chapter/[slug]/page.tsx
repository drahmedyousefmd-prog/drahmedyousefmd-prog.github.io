import type { Prescription } from "@/lib/types";
import { CHAPTER_ORDER, getChapter, categoryForSlug } from "@/lib/chapters";
import { ChapterPageApp } from "@/components/ChapterPageApp";
import { ChapterIcon, BackIcon, LogoGlyph } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { SafetyBanner } from "@/components/portal/SafetyBanner";
import { BackLink } from "@/components/portal/BackLink";
import { SITE, SITE_URL } from "@/lib/site";
import Link from "next/link";

// Single source of truth: prescriptions.json — chapter data is filtered below.
import data from "@/data/prescriptions.json";

const prescriptions = data as unknown as Prescription[];

export function generateStaticParams() {
  return CHAPTER_ORDER.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/doctor/chapter/[slug]">) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  const catName = categoryForSlug(slug);
  const count = prescriptions.filter((p) => p.category === catName).length;
  const url = `${SITE_URL}/doctor/chapter/${slug}`;
  if (!chapter) return { title: "Rochetta" };
  return {
    title: `${chapter.name} — ${chapter.arabicName}`,
    description: `دليل حالات ${chapter.arabicName} (${count} حالة) من Rochetta — دليل روشتات مصر: العلاج المقترح، التعليمات، البدائل، والتفاعلات الدوائية.`,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${chapter.name} — ${chapter.arabicName} | Rochetta`,
      description: `دليل حالات ${chapter.arabicName} (${count} حالة) — روشتات، بدائل وأسعار.`,
    },
  };
}

export default async function ChapterPage({ params }: PageProps<"/doctor/chapter/[slug]">) {
  const { slug } = await params;
  const chapter = getChapter(slug) ?? CHAPTER_ORDER[CHAPTER_ORDER.length - 1];
  const catName = categoryForSlug(slug);
  const chapterRx = prescriptions.filter((p) => p.category === catName);

  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{
        background: "color-mix(in srgb, " + chapter.colorHex + " 6%, var(--bg))",
      }}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Rochetta", item: SITE_URL },
            {
              "@type": "ListItem",
              position: 2,
              name: chapter.name,
              item: `${SITE_URL}/doctor/chapter/${chapter.slug}`,
            },
          ],
        }}
      />
      {/* Quiet header */}
      <SafetyBanner />
      <header className="case-header">
        <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="site-logo case-logo no-print" aria-label={`${SITE.name} — الرئيسية`}>
            <span className="site-logo-chip">
              <LogoGlyph className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">{SITE.name}</span>
          </Link>
          <BackLink
            href="/"
            className="no-print flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            label="رجوع إلى الصفحة السابقة"
          >
            <BackIcon className="h-4 w-4" />
          </BackLink>
          <div className="min-w-0">
            <h1 className="text-[22px] font-extrabold leading-tight text-[var(--text-primary)]">
              {chapter.name}
            </h1>
            <span
              className="mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-bold"
              style={{
                background: `color-mix(in srgb, ${chapter.colorHex} 10%, white)`,
                color: chapter.colorHex,
              }}
            >
              <ChapterIcon name={chapter.icon} className="h-3 w-3" />
              {chapter.arabicName}
            </span>
          </div>
        </div>
      </header>

      <ChapterPageApp
        name={chapter.name}
        arabicName={chapter.arabicName}
        prescriptions={chapterRx}
      />
    </div>
  );
}