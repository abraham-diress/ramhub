import Link from "next/link";
import SearchBar from "@/components/SearchBar";

const SECTIONS = [
  {
    href: "/courses",
    title: "Courses",
    description: "What to register for, when, and tips from students who've taken them.",
  },
  {
    href: "/paperwork",
    title: "Paperwork",
    description: "CPT/OPT, health insurance waivers, immunization records — and their deadlines.",
  },
  {
    href: "/contacts",
    title: "Contacts",
    description: "The right office to reach out to, so you stop guessing.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Everything international students at Fordham keep asking their friends about.
        </h1>
        <p className="text-black/60 dark:text-white/60">
          Course picks, paperwork deadlines, and who to contact — gathered in one place so you
          don&apos;t have to ask around every semester.
        </p>
        <SearchBar />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-black/10 p-5 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
          >
            <h2 className="font-medium">{s.title}</h2>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
