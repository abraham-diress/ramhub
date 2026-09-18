import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinalCta() {
  return (
    <section className="px-6 py-20 text-center">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">
        Built by a Fordham student who had to ask around.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        Free, and open to corrections. If something here is wrong or out of date, tell us and it gets
        fixed for the next cohort.
      </p>
      <Button asChild className="mt-6">
        <Link href="/register">Create an account</Link>
      </Button>
    </section>
  );
}
