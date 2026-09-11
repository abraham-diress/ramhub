import { getContacts } from "@/lib/api";

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Who to reach out to, so you stop guessing.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {contacts.map((contact) => (
          <article key={contact.id} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
            <h2 className="font-medium">{contact.name}</h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              {contact.role} · {contact.office}
            </p>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70">
              Reach out for: {contact.reach_out_for}
            </p>
            <div className="mt-2 flex gap-4 text-sm">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="underline underline-offset-4">
                  {contact.email}
                </a>
              )}
              {contact.phone && <span className="text-black/60 dark:text-white/60">{contact.phone}</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
