import type { Metadata } from "next";
import { PatientHome } from "@/components/patient/PatientHome";

export const metadata: Metadata = {
  title: "بوابة المريض — Rochetta",
  description:
    "اطلب خدمة من بوابة المريض: استشارة طبية عامة، قراءة تحليل، اقرألي الروشتة، رسم قلب (ECG)، نظام غذائي، خطة علاجية — بدون تسجيل دخول.",
  alternates: { canonical: "/patient" },
};

export default function PatientPage() {
  return <PatientHome />;
}