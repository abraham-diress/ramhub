import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCta() {
  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border bg-card px-8 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_120%,color-mix(in_oklch,var(--primary)_15%,transparent),transparent)]" />
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Stop asking your friends. Start with RamHub.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Free to use, built for Fordham, and ready in under a minute.
        </p>
        <Button asChild size="lg" className="group mt-8">
          <Link href="/register">
            Create your free account
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
