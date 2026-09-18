import { Info } from "lucide-react";
import PaperworkCard from "@/features/paperwork/PaperworkCard";
import { getPaperwork, PHASE_LABELS, PHASE_ORDER } from "@/lib/api";

export const metadata = {
  title: "Paperwork and deadlines | RamHub",
  description:
    "Every form, deadline, and office a Fordham international student needs, ordered by when it matters.",
};

export default async function PaperworkPage() {
  const items = await getPaperwork();
  const groups = PHASE_ORDER.map((phase) => ({
    phase,
    label: PHASE_LABELS[phase],
    items: items.filter((item) => item.phase === phase),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Paperwork and deadlines</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          In the order you hit them, from the day you get your I-20 to the month you file for OPT.
          Every item links to the page it came from.
        </p>
      </header>

      <div className="mt-6 flex gap-3 rounded-xl border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          This is a student-maintained summary, not legal or immigration advice. Rules and dollar
          amounts change, sometimes mid-semester. Confirm anything that affects your status with the
          Office for International Services before you act on it.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {groups.map((group) => (
          <section key={group.phase}>
            <div className="mb-4 flex items-baseline gap-3">
              <h2 className="font-heading text-lg font-semibold tracking-tight">{group.label}</h2>
              <span className="text-xs tabular-nums text-muted-foreground">
                {group.items.length} {group.items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="space-y-3">
              {group.items.map((item) => (
                <PaperworkCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
