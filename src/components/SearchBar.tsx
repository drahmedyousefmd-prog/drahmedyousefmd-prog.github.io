"use client";

import { SearchGlyph } from "./icons";

export function SearchBar({
  value,
  onChange,
  placeholder,
  accent = "#2E6560",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 shadow-sm">
      <SearchGlyph className="h-4 w-4 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
        style={{ caretColor: accent }}
      />
      {value && (
        <button
          type="button"
          aria-label="مسح البحث"
          onClick={() => onChange("")}
          className="text-stone-400 hover:text-stone-600 text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}