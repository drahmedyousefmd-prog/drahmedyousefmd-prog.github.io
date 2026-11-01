import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal, Inter } from "next/font/google";
import { SITE, SITE_URL, CONTACT, DOCTOR } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/icons";
import { ModeProvider } from "@/lib/mode";
import "../../assets/css/design-tokens.css";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  display: "swap",
  weight: ["400", "500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.homeTitle,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE.name,
    title: SITE.homeTitle,
    description: SITE.description,
    locale: "ar_EG",
    alternateLocale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.taglineAr} | ${SITE.taglineEn}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.homeTitle,
    description: SITE.descriptionEn,
    images: ["/og-image.png"],
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${tajawal.variable} ${inter.variable}`}
    >
      <body>
        <ModeProvider>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: SITE.name,
                  alternateName: SITE.alternateNames,
                  url: SITE_URL,
                  inLanguage: "ar-EG",
                  description: SITE.descriptionEn,
                  publisher: { "@id": `${SITE_URL}/#author` },
                },
                {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#author`,
                  name: DOCTOR.name,
                  jobTitle: DOCTOR.jobTitle,
                  sameAs: DOCTOR.sameAs,
                },
                {
                  "@type": "MedicalWebPage",
                  "@id": `${SITE_URL}/#webpage`,
                  name: `${SITE.name} | ${SITE.nameAr}`,
                  url: SITE_URL,
                  inLanguage: "ar",
                  audience: {
                    "@type": "MedicalAudience",
                    audienceType: "Clinician",
                  },
                  isPartOf: { "@id": `${SITE_URL}/#website` },
                  author: { "@id": `${SITE_URL}/#author` },
                },
              ],
            }}
          />
          {children}
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-fab"
            aria-label="التواصل عبر واتساب"
            title="تواصل عبر واتساب"
          >
            <WhatsAppIcon className="h-6 w-6" />
          </a>
        </ModeProvider>
      </body>
    </html>
  );
}