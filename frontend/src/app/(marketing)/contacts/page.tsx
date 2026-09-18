import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { getContacts, type Contact } from "@/lib/api";

export const metadata = {
  title: "Who to contact | RamHub",
  description: "The Fordham office that actually handles each problem, with emails, phones, and room numbers.",
};

const CATEGORY_LABELS: Record<string, string> = {
  immigration: "Immigration and visa",
  health: "Health and wellbeing",
  academics: "Academics and registration",
  money: "Money and billing",
  housing: "Housing",
  safety: "Safety",
  campus: "Campus services",
  general: "Other",
};

const CATEGORY_ORDER = [
  "immigration",
  "academics",
  "health",
  "money",
  "housing",
  "safety",
  "campus",
  "general",
];

function ContactCard({ contact }: { contact: Contact }) {
  const emails = contact.email?.split("|").map((e) => e.trim()) ?? [];

  return (
    <article className="rounded-xl border bg-card p-5">
      <h3 className="font-medium">{contact.name}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{contact.role}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{contact.reach_out_for}</p>

      <div className="mt-4 space-y-1.5 border-t pt-3 text-xs text-muted-foreground">
        {emails.map((entry) => {
          const address = entry.match(/[^\s|]+@[^\s|]+/)?.[0];
          return (
            <p key={entry} className="flex items-center gap-2">
              <Mail className="size-3 shrink-0" />
              {address ? (
                <a href={`mailto:${address}`} className="underline underline-offset-4 hover:text-foreground">
                  {entry}
                </a>
              ) : (
                entry
              )}
            </p>
          );
        })}
        {contact.phone && (
          <p className="flex items-center gap-2">
            <Phone className="size-3 shrink-0" />
            {contact.phone}
          </p>
        )}
        {contact.rose_hill_location && (
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3 shrink-0" />
            <span>
              <span className="text-foreground">Rose Hill:</span> {contact.rose_hill_location}
            </span>
          </p>
        )}
        {contact.lincoln_center_location && (
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3 shrink-0" />
            <span>
              <span className="text-foreground">Lincoln Center:</span> {contact.lincoln_center_location}
            </span>
          </p>
        )}
        {contact.website && (
          <p className="flex items-center gap-2">
            <Globe className="size-3 shrink-0" />
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Website
            </a>
          </p>
        )}
      </div>
    </article>
  );
}

export default async function ContactsPage() {
  const contacts = await getContacts();
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category] ?? category,
    items: contacts.filter((c) => c.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Who to contact</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fordham has a lot of offices and they all sound similar. This maps the problem you have to
          the people who can actually fix it.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="mb-4 font-heading text-lg font-semibold tracking-tight">{group.label}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.items.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
