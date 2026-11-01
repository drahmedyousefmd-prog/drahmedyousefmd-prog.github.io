import type { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { CreatorFooter } from "./CreatorFooter";

/** Shared shell for the static public pages (/categories, /about, /contact,
 *  /privacy): top navigation + centred article column + creator footer. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh" id="top">
      <SiteNav />
      <main className="mx-auto w-full max-w-[860px] px-4 pb-16 pt-28 sm:px-6">
        {children}
      </main>
      <CreatorFooter />
    </div>
  );
}
