import { Course, getCourses } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

function groupByProgram(courses: Course[]): Record<string, Course[]> {
  return courses.reduce<Record<string, Course[]>>((acc, course) => {
    (acc[course.program] ??= []).push(course);
    return acc;
  }, {});
}

export default async function CoursesPage() {
  const courses = await getCourses();
  const byProgram = groupByProgram(courses);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Courses</h1>
        {Object.entries(byProgram).map(([program, list]) => (
          <section key={program} className="flex flex-col gap-3">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{program}</h2>
            <div className="flex flex-col gap-3">
              {list.map((course) => (
                <article key={course.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-medium">
                      {course.code} — {course.title}
                    </h3>
                    <Badge variant="secondary" className="shrink-0">
                      {course.credits} credits
                      {course.recommended_term ? ` · ${course.recommended_term}` : ""}
                    </Badge>
                  </div>
                  {course.description && <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>}
                  {course.tips && <p className="mt-2 text-sm text-muted-foreground">💡 {course.tips}</p>}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
