"use client";

import { SearchIcon } from "./icons";

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
    <div className="search-box">
      <SearchIcon />
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
          className="flex h-6 w-6 items-center justify-center rounded-full border-none bg-[var(--surface-raised)] text-lg leading-none text-[var(--text-muted)] transition hover:text-[var(--brand)]"
        >
          ×
        </button>
      )}
    </div>
  );
}