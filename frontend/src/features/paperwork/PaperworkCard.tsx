import { AlertTriangle, ExternalLink } from "lucide-react";
import TrackButton from "@/features/paperwork/TrackButton";
import type { PaperworkItem } from "@/lib/api";

function formatDeadline(item: PaperworkItem) {
  if (item.deadline_date) {
    const formatted = new Date(item.deadline_date + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return item.deadline_note ? `${formatted}, ${item.deadline_note}` : formatted;
  }
  return item.deadline_note;
}

export default function PaperworkCard({ item }: { item: PaperworkItem }) {
  const deadline = formatDeadline(item);

  return (
    <article className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-medium leading-snug">{item.title}</h3>
        <TrackButton paperworkId={item.id} />
      </div>

      {deadline && (
        <p
          className={`mt-2 flex items-start gap-1.5 text-xs font-medium ${
            item.is_critical ? "text-amber-600 dark:text-amber-500" : "text-muted-foreground"
          }`}
        >
          {item.is_critical && <AlertTriangle className="mt-0.5 size-3 shrink-0" />}
          {deadline}
        </p>
      )}

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

      {item.steps.length > 0 && (
        <ol className="mt-4 space-y-1.5">
          {item.steps.map((step, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium tabular-nums">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
        <span>{item.applies_to}</span>
        {item.contact && (
          <span>
            Ask <span className="text-foreground">{item.contact.name}</span>
            {item.contact.email && ` · ${item.contact.email}`}
          </span>
        )}
        {item.external_link && (
          <a
            href={item.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-foreground"
          >
            Official page
            <ExternalLink className="size-3" />
          </a>
        )}
        {item.source_url && (
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 hover:text-foreground"
            title={item.source_name ?? undefined}
          >
            Source
            {item.last_verified && ` · checked ${item.last_verified}`}
          </a>
        )}
      </div>
    </article>
  );
}
