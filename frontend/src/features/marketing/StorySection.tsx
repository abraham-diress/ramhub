const STATS = [
  { value: "0", label: "Centralized resources before RamHub" },
  { value: "∞", label: "Times the same question got asked" },
  { value: "1", label: "Place to check now" },
];

export default function StorySection() {
  return (
    <section className="border-y bg-muted/30 px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Every semester, the same questions.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Before RamHub, Fordham had no internal resource for the practical stuff international
            students actually need — which courses to take, what paperwork to file and by when,
            who to contact. That knowledge lived in group chats and got re-discovered by every new
            cohort, right when getting it wrong mattered most.
          </p>
          <p className="mt-4 text-muted-foreground">
            RamHub gathers it once, keeps it discoverable, and gives you a place to actually track
            your own tasks and deadlines — instead of a pinned Google Doc nobody updates.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl border bg-card p-5 text-center">
              <p className="font-heading text-3xl font-semibold text-primary">{stat.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
