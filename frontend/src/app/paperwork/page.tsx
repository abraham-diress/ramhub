import { getPaperwork } from "@/lib/api";

function formatDeadline(dateStr: string | null, note: string | null) {
  if (dateStr) {
    const formatted = new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return note ? `${formatted} — ${note}` : formatted;
  }
  return note ?? "No fixed date";
}

export default async function PaperworkPage() {
  const items = await getPaperwork();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Paperwork</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          The forms and filings international students need to stay on top of.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-medium">{item.title}</h2>
              <span className="shrink-0 text-xs font-medium text-black/60 dark:text-white/60">
                {formatDeadline(item.deadline_date, item.deadline_note)}
              </span>
            </div>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70">{item.description}</p>
            <p className="mt-2 text-xs text-black/50 dark:text-white/50">Applies to: {item.applies_to}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {item.contact && (
                <span className="text-black/60 dark:text-white/60">
                  Contact: <span className="font-medium">{item.contact.name}</span>
                </span>
              )}
              {item.external_link && (
                <a
                  href={item.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black underline underline-offset-4 dark:text-white"
                >
                  Official page →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
