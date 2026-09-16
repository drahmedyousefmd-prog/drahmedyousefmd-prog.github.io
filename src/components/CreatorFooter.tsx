import { MailIcon, LinkedinIcon, StethoscopeIcon } from "./icons";

export function CreatorFooter() {
  return (
    <footer className="creator-footer">
      <div className="creator-info">
        <div className="creator-avatar" aria-hidden="true">
          <StethoscopeIcon />
        </div>
        <div>
          <p className="creator-name">د. أحمد يوسف</p>
          <p className="creator-role">منشئ ومطوّر Rochetta</p>
        </div>
      </div>
      <div className="creator-links">
        <a
          className="creator-link"
          href="mailto:Dr.ahmed.yousef.md@gmail.com"
        >
          <MailIcon />
          تواصل عبر البريد
        </a>
        <a
          className="creator-link"
          href="https://www.linkedin.com/in/dr-ahmed-yousef/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon />
          LinkedIn
        </a>
      </div>
      <p className="creator-copyright">© 2026 Rochetta — دليل روشتات مصر</p>
    </footer>
  );
}