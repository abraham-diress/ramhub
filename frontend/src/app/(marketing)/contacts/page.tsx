import { getContacts } from "@/lib/api";

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Who to reach out to, so you stop guessing.</p>
        </div>
        <div className="flex flex-col gap-3">
          {contacts.map((contact) => (
            <article key={contact.id} className="rounded-xl border bg-card p-4">
              <h2 className="font-medium">{contact.name}</h2>
              <p className="text-sm text-muted-foreground">
                {contact.role} · {contact.office}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Reach out for: {contact.reach_out_for}</p>
              <div className="mt-2 flex gap-4 text-sm">
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="underline underline-offset-4">
                    {contact.email}
                  </a>
                )}
                {contact.phone && <span className="text-muted-foreground">{contact.phone}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
