import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rochetta — Medical Reference",
  description: "Medical prescriptions and treatment guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="ltr">
      <body>{children}</body>
    </html>
  );
}