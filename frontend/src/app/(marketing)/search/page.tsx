import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { search, SearchResult } from "@/lib/api";

const TYPE_LABEL: Record<SearchResult["type"], string> = {
  course: "Course",
  paperwork: "Paperwork",
  contact: "Contact",
};

const TYPE_HREF: Record<SearchResult["type"], string> = {
  course: "/courses",
  paperwork: "/paperwork",
  contact: "/contacts",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await search(q) : [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Search</h1>
          <SearchBar initialQuery={q} />
        </div>

        {q && (
          <p className="text-sm text-muted-foreground">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
          </p>
        )}

        <div className="flex flex-col gap-3">
          {results.map((r) => (
            <Link
              key={`${r.type}-${r.id}`}
              href={TYPE_HREF[r.type]}
              className="rounded-xl border bg-card p-4 transition hover:border-primary/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {TYPE_LABEL[r.type]}
              </span>
              <h2 className="mt-1 font-medium">{r.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{r.snippet}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
