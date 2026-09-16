import type { ReactElement, SVGProps } from "react";
import {
  Brain,
  Pill,
  ShieldPlus,
  HeartPulse,
  Droplets,
  LayoutGrid,
  Search,
  Printer,
  ArrowLeft,
  Mail,
  Stethoscope,
  OctagonAlert,
  TriangleAlert,
  CircleCheck,
  ChevronDown,
  ClipboardList,
  CloudRain,
  type LucideIcon,
} from "lucide-react";
import type { ChapterIconKey } from "@/lib/types";

export function SkinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2 5.5c3-1.5 6 1.5 9 0s6 1.5 9 0" />
      <path d="M2 12c3-1.5 6 1.5 9 0s6 1.5 9 0" />
      <path d="M2 18.5c3-1.5 6 1.5 9 0s6 1.5 9 0" />
    </svg>
  );
}

export function LungsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3.5v4" />
      <path d="M12 7.5c-1.4 0-2.7 1.2-3 2.8-.3 1.5.3 3.2 0 4.7-.5 2.5 1.1 4.8 3.5 4.8 1 0 1.8-.5 1.8-1.4V10l-2.3-2.5z" />
      <path d="M12 7.5c1.4 0 2.7 1.2 3 2.8.3 1.5-.3 3.2 0 4.7.5 2.5-1.1 4.8-3.5 4.8-1 0-1.8-.5-1.8-1.4V10l2.3-2.5z" />
    </svg>
  );
}

export function StomachIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 3.2c.8.8.8 1.4 0 2.2M13.6 2.7c.8.8.8 1.4 0 2.2" />
      <path d="M3.5 13C3.5 8.9 7.4 5 12.5 5s9 3.9 9 8c0 3.8-2.9 6.5-9 6.5S3.5 16.8 3.5 13z" />
      <path d="M5.5 19.5h14" />
    </svg>
  );
}

export function LinkedinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" />
      <path d="M8.1 11.3v5.2" />
      <path d="M8.1 7.7v.4" />
      <path d="M12.4 16.5v-3.1c0-1.1.7-1.8 1.7-1.8s1.7.8 1.7 1.8v3.1" />
      <path d="M12.4 11.3v.2" />
    </svg>
  );
}

/* ---- Chapter icon mapping ---- */

const LUCIDE_MAP: Record<string, LucideIcon> = {
  brain: Brain,
  pill: Pill,
  syringe: ShieldPlus,
  heart: HeartPulse,
  droplet: Droplets,
  grid: LayoutGrid,
};

const CUSTOM_MAP: Record<string, (p: { className?: string }) => ReactElement> = {
  jar: SkinIcon,
  lungs: LungsIcon,
  bowl: StomachIcon,
};

export function ChapterIcon({
  name,
  className = "",
}: {
  name: ChapterIconKey;
  className?: string;
}) {
  const Lucide = LUCIDE_MAP[name];
  if (Lucide) {
    return <Lucide className={className} strokeWidth={2} aria-hidden="true" />;
  }
  const Custom = CUSTOM_MAP[name];
  return <Custom className={className} />;
}

/* ---- UI icons ---- */

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

export const SearchIcon = (p: IconProps) => <Search strokeWidth={2} {...p} />;
export const PrintIcon = (p: IconProps) => <Printer strokeWidth={2} {...p} />;
export const BackIcon = (p: IconProps) => <ArrowLeft strokeWidth={2} {...p} />;
export const MailIcon = (p: IconProps) => <Mail strokeWidth={2} {...p} />;
export const StethoscopeIcon = (p: IconProps) => <Stethoscope strokeWidth={2} {...p} />;
export const ChevronDownIcon = (p: IconProps) => <ChevronDown strokeWidth={2} {...p} />;
export const OctagonAlertIcon = (p: IconProps) => <OctagonAlert strokeWidth={2} {...p} />;
export const TriangleAlertIcon = (p: IconProps) => <TriangleAlert strokeWidth={2} {...p} />;
export const CircleCheckIcon = (p: IconProps) => <CircleCheck strokeWidth={2} {...p} />;
export const PillIcon = (p: IconProps) => <Pill strokeWidth={2} {...p} />;
export const CloudRainIcon = (p: IconProps) => <CloudRain strokeWidth={2} {...p} />;
export const ClipboardListIcon = (p: IconProps) => <ClipboardList strokeWidth={2} {...p} />;