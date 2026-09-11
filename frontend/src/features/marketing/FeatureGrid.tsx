"use client";

import { motion } from "motion/react";
import { LayoutDashboard, CalendarDays, FileText, Search, Users, BookOpen } from "lucide-react";

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Trello-style boards",
    description: "Create boards for each semester, drag cards between To Do, In Progress, and Done.",
  },
  {
    icon: CalendarDays,
    title: "One calendar",
    description: "Card due dates show up automatically alongside events you add yourself.",
  },
  {
    icon: FileText,
    title: "Paperwork, demystified",
    description: "CPT/OPT, health insurance, immunization records — with real deadlines and who to ask.",
  },
  {
    icon: BookOpen,
    title: "Course intel",
    description: "What to register for, when, and tips from students who've actually taken it.",
  },
  {
    icon: Users,
    title: "The right contact",
    description: "Stop guessing which office handles what — it's mapped out for you.",
  },
  {
    icon: Search,
    title: "Search everything",
    description: "One search bar across courses, paperwork, and contacts.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: (i % 3) * 0.08, ease: "easeOut" as const },
  }),
};

export default function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-xl text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">One platform, not five group chats</h2>
        <p className="mt-3 text-muted-foreground">
          RamHub combines the onboarding knowledge Fordham never wrote down with the tools you
          actually use to stay organized.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            custom={i}
            className="rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <feature.icon className="size-5" />
            </div>
            <h3 className="font-medium">{feature.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
