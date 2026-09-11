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
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Paperwork</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The forms and filings international students need to stay on top of.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-medium">{item.title}</h2>
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                  {formatDeadline(item.deadline_date, item.deadline_note)}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">Applies to: {item.applies_to}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {item.contact && (
                  <span className="text-muted-foreground">
                    Contact: <span className="font-medium text-foreground">{item.contact.name}</span>
                  </span>
                )}
                {item.external_link && (
                  <a
                    href={item.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    Official page →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
