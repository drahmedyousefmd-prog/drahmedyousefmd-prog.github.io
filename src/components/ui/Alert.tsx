import type { ReactNode } from "react";

export type AlertTone = "danger" | "warning" | "safe" | "info";

/**
 * Accessible alert/status card. `danger` is announced as an alert;
 * everything else as a polite status region.
 */
export function Alert({
  tone,
  icon,
  title,
  children,
  className = "",
  shake = false,
}: {
  tone: AlertTone;
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  shake?: boolean;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={`alert ${tone}${shake ? " shake" : ""} ${className}`.trim()}
    >
      {icon}
      <div className="min-w-0">
        {title != null && <div className="font-bold">{title}</div>}
        {children != null && (
          <div className={title != null ? "mt-0.5" : ""}>{children}</div>
        )}
      </div>
    </div>
  );
}