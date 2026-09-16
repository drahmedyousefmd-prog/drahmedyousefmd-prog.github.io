import { MailIcon, LinkedinIcon, LogoGlyph } from "./icons";
import { CONTACT, SITE } from "@/lib/site";

export function CreatorFooter() {
  return (
    <footer className="creator-footer">
      <div className="creator-info">
        <div className="creator-avatar" aria-hidden="true">
          <LogoGlyph className="h-[18px] w-[18px]" />
        </div>
        <div>
          <p className="creator-name">{CONTACT.creatorName}</p>
          <p className="creator-role">{CONTACT.creatorRole}</p>
        </div>
      </div>
      <div className="creator-links">
        <a className="creator-link" href={`mailto:${CONTACT.email}`}>
          <MailIcon />
          تواصل عبر البريد
        </a>
        <a
          className="creator-link"
          href={CONTACT.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon />
          LinkedIn
        </a>
      </div>
      <p className="creator-copyright">
        © 2026 {SITE.name} — {SITE.brandLine}
      </p>
    </footer>
  );
}