"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search courses, paperwork, contacts…"
        className="w-full rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        Search
      </button>
    </form>
  );
}
