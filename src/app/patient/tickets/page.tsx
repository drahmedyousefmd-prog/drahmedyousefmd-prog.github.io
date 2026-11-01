import type { Metadata } from "next";
import { RedirectToConsult } from "@/components/RedirectToConsult";

export const metadata: Metadata = {
  title: "طلباتي",
  robots: { index: false, follow: false },
};

export default function PatientTicketsPage() {
  return <RedirectToConsult path="/my-requests" />;
}
