"use client";

/**
 * Search input built on the `.field` token style. Clear button appears
 * when there is a value.
 */
export function SearchBar({
  value,
  onChange,
  placeholder,
  accent = "var(--brand)",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  accent?: string;
}) {
  return (
    <div className="field">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ caretColor: accent }}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          aria-label="مسح البحث"
          onClick={() => onChange("")}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-none bg-[var(--surface-raised)] text-lg leading-none text-[var(--text-muted)] transition hover:text-[var(--accent)]"
        >
          ×
        </button>
      )}
    </div>
  );
}