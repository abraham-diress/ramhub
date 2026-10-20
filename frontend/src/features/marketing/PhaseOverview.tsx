import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PHASE_LABELS, PHASE_ORDER, type Phase, type PaperworkItem } from "@/lib/api";

// The phases themselves are part of the product, not data, so the section still describes
// what is inside when the API cannot be reached. Live counts and titles enrich it when
// they load rather than being the only thing holding it up.
const PHASE_BLURBS: Record<Phase, string> = {
  before_arrival: "Signing your I-20, the SEVIS fee, the visa interview, and what to budget.",
  first_10_days: "Immigration check-in, orientation, immunization records, and the insurance waiver.",
  first_semester: "Staying full-time, what work you are allowed to do, and applying for an SSN.",
  ongoing: "Travel signatures before you fly, and the scams that target students.",
  employment: "CPT before an internship, and the OPT filing window in your final year.",
};

export default function PhaseOverview({ items }: { items: PaperworkItem[] }) {
  const total = items.length;
  const phases = PHASE_ORDER.map((phase) => ({
    phase,
    label: PHASE_LABELS[phase],
    items: items.filter((item) => item.phase === phase),
  }));

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
          {total > 0 ? `All ${total} items` : "See the checklist"}
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
              {group.items.length > 0 && (
                <span className="text-xs tabular-nums text-muted-foreground">
                  {group.items.length}
                </span>
              )}
            </div>

            {group.items.length > 0 ? (
              <ul className="mt-3 space-y-1.5">
                {group.items.slice(0, 3).map((item) => (
                  <li key={item.id} className="truncate text-sm text-muted-foreground">
                    {item.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {PHASE_BLURBS[group.phase]}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
