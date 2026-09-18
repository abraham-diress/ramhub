"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative px-6 pt-16 pb-12 sm:pt-32 sm:pb-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_50%_50%_at_50%_-20%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-2xl text-center"
      >
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          The Fordham handbook international students never got.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground text-pretty">
          Every deadline, form, and office you need, in the order you actually need them. Then track
          your own on a board that syncs to your calendar.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="group">
            <Link href="/paperwork">
              See the checklist
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/register">Create an account</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
