import type { Metadata } from "next";
import { PatientTicketsApp } from "@/components/patient/PatientTicketsApp";

export const metadata: Metadata = {
  title: "تذاكري — Rochetta",
  alternates: { canonical: "/patient/tickets" },
};

export default function TicketsPage() {
  return <PatientTicketsApp />;
}