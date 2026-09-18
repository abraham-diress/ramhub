import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PHASE_LABELS, PHASE_ORDER, type PaperworkItem } from "@/lib/api";

export default function PhaseOverview({ items }: { items: PaperworkItem[] }) {
  const phases = PHASE_ORDER.map((phase) => ({
    phase,
    label: PHASE_LABELS[phase],
    items: items.filter((item) => item.phase === phase),
  })).filter((group) => group.items.length > 0);

  if (phases.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Sorted by when you need it
        </h2>
        <Link
          href="/paperwork"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          All {items.length} items
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {phases.map((group) => (
          <Link
            key={group.phase}
            href="/paperwork"
            className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-medium">{group.label}</h3>
              <span className="text-xs tabular-nums text-muted-foreground">{group.items.length}</span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {group.items.slice(0, 3).map((item) => (
                <li key={item.id} className="truncate text-sm text-muted-foreground">
                  {item.title}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </section>
  );
}
