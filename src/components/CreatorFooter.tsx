import { MailIcon, LinkedinIcon, StethoscopeIcon } from "./icons";

const LINKS = [
  {
    href: "mailto:Dr.ahmed.yousef.md@gmail.com",
    target: "_blank",
    rel: "noopener noreferrer",
    label: "تواصل عبر البريد",
    Icon: MailIcon,
  },
  {
    href: "https://www.linkedin.com/in/dr-ahmed-yousef/",
    target: "_blank",
    rel: "noopener noreferrer",
    label: "LinkedIn",
    Icon: LinkedinIcon,
  },
];

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
        {LINKS.map(({ href, target, rel, label, Icon }) => (
          <a key={href} className="creator-link" href={href} target={target} rel={rel}>
            <Icon />
            {label}
          </a>
        ))}
      </div>
      <p className="creator-copyright">© 2026 Rochetta — دليل روشتات مصر</p>
    </footer>
  );
}