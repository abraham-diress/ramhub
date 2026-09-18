import { Badge } from "@/components/ui/badge";
import ContributeForm from "@/features/contribute/ContributeForm";
import { getCourses } from "@/lib/api";

export const metadata = {
  title: "Programs and course notes | RamHub",
  description: "Program requirements for Fordham graduate programs, plus course notes from students.",
};

export default async function CoursesPage() {
  const programs = await getCourses();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Programs and course notes</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Degree requirements come from the Fordham bulletin. Everything about what a course is
          actually like has to come from students who took it.
        </p>
      </header>

      <div className="mt-8 space-y-3">
        {programs.map((program) => (
          <article key={program.id} className="rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-medium">{program.title}</h2>
              <Badge variant="secondary" className="shrink-0">
                {program.credits} credits
              </Badge>
            </div>
            {program.description && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{program.description}</p>
            )}
            {program.tips && (
              <p className="mt-3 border-t pt-3 text-sm leading-relaxed text-muted-foreground">
                {program.tips}
              </p>
            )}
          </article>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Add a course note</h2>
        <p className="mt-2 mb-4 text-sm text-muted-foreground">
          There is no honest way to publish workload and difficulty notes without students writing
          them. If you have taken a course here, this is the part only you can fill in. Submissions
          are reviewed before they go live.
        </p>
        <ContributeForm defaultCategory="course" />
      </section>
    </div>
  );
}
