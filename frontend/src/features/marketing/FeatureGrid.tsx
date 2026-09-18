import { ShieldCheck, LayoutDashboard, Link2 } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Sourced, not remembered",
    description:
      "Every item links to the Fordham or federal page it came from, with the date it was last checked. If it is out of date, you can see that.",
  },
  {
    icon: LayoutDashboard,
    title: "Your own board",
    description:
      "Move anything from the checklist onto a personal board, drag it between columns, and see the due dates on one calendar.",
  },
  {
    icon: Link2,
    title: "The right office, first try",
    description:
      "Each deadline names the office that actually handles it, with the email, phone, and room number for both campuses.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="border-t bg-muted/20 px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title}>
            <feature.icon className="size-5 text-primary" />
            <h3 className="mt-3 font-medium">{feature.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
