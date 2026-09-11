import { Course, getCourses } from "@/lib/api";

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
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
      {Object.entries(byProgram).map(([program, list]) => (
        <section key={program} className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
            {program}
          </h2>
          <div className="flex flex-col gap-3">
            {list.map((course) => (
              <article
                key={course.id}
                className="rounded-xl border border-black/10 p-4 dark:border-white/10"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-medium">
                    {course.code} — {course.title}
                  </h3>
                  <span className="shrink-0 text-xs text-black/50 dark:text-white/50">
                    {course.credits} credits
                    {course.recommended_term ? ` · ${course.recommended_term}` : ""}
                  </span>
                </div>
                {course.description && (
                  <p className="mt-2 text-sm text-black/70 dark:text-white/70">{course.description}</p>
                )}
                {course.tips && (
                  <p className="mt-2 text-sm text-black/50 dark:text-white/50">💡 {course.tips}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
