"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoardPreview from "@/features/marketing/BoardPreview";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-16 sm:pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent)]" />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            Built by a Fordham MS in Data Science student
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mt-6 font-heading text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          Everything international students at{" "}
          <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-primary bg-clip-text text-transparent">
            Fordham
          </span>{" "}
          need, in one place.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-5 max-w-xl text-balance text-lg text-muted-foreground"
        >
          Course picks, paperwork deadlines, and the right contacts — plus your own boards and
          calendar to actually stay on top of it. No more asking around every semester.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="group">
            <Link href="/register">
              Get started free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/courses">Browse resources</Link>
          </Button>
        </motion.div>
      </div>

      <div className="mt-16">
        <BoardPreview />
      </div>
    </section>
  );
}
