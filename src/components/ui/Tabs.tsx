"use client";

import {
  useId,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface TabItem {
  key: string;
  /** Label node — icon + text go here. */
  label: ReactNode;
  /** Optional numeric badge rendered after the label. */
  badge?: number;
  /** Sets the active `--tab-color` for this tab. */
  color?: string;
  content: ReactNode;
}

/**
 * Accessible tabs (WAI-ARIA tabs pattern):
 * arrow-key + Home/End navigation, roving tabindex, labelled panels.
 * Visual styles come from the `tablistCls` / `tabCls` / `panelCls` classes.
 */
export function Tabs({
  items,
  active,
  onActive,
  tablistCls = "case-tabs",
  tabCls = "case-tab",
  panelCls = "tab-panel",
  ariaLabel,
}: {
  items: TabItem[];
  active: number;
  onActive: (index: number) => void;
  tablistCls?: string;
  tabCls?: string;
  panelCls?: string;
  ariaLabel?: string;
}) {
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = items.length;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % count;
    else if (e.key === "ArrowLeft") next = (index - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    if (next !== null) {
      e.preventDefault();
      onActive(next);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel} className={tablistCls}>
        {items.map((item, i) => (
          <button
            key={item.key}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${item.key}`}
            aria-selected={active === i}
            aria-controls={`${baseId}-panel-${item.key}`}
            tabIndex={active === i ? 0 : -1}
            className={`${tabCls} ${active === i ? "active" : ""}`.trim()}
            style={{ "--tab-color": item.color } as CSSProperties}
            onClick={() => onActive(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            {item.label}
            {typeof item.badge === "number" && (
              <span className={`tab-badge ${item.badge === 0 ? "empty" : ""}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.key}
          role="tabpanel"
          id={`${baseId}-panel-${item.key}`}
          aria-labelledby={`${baseId}-tab-${item.key}`}
          className={`${panelCls} ${active === i ? "" : "hidden"}`.trim()}
          hidden={active !== i}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}