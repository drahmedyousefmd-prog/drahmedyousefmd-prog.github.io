import type { Metadata } from "next";
import { RedirectToConsult } from "@/components/RedirectToConsult";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "طلب خدمة",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return SERVICES.map((s) => ({ serviceType: s.type }));
}

export default async function PatientNewPage({
  params,
}: {
  params: Promise<{ serviceType: string }>;
}) {
  const { serviceType } = await params;
  return <RedirectToConsult path={`/request/${serviceType}`} />;
}
