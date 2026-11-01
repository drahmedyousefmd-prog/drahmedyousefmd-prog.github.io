import type { Metadata } from "next";
import { RedirectToConsult } from "@/components/RedirectToConsult";

export const metadata: Metadata = {
  title: "الاستشارات الطبية",
  robots: { index: false, follow: false },
};

export default function PatientPage() {
  return <RedirectToConsult />;
}
